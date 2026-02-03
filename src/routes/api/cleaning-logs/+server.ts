import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { cleaningLogs, buildings } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'
import dayjs from 'dayjs'

export const POST = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { building_id, date, status } = body

  if (!building_id || !date || !status) {
    return json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Calculate earned amount
  // We should fetch the building to get current price.
  // Note: If price changes, historical logs keep their value (good).
  // But here we insert new log.
  const [building] = await db
    .select()
    .from(buildings)
    .where(eq(buildings.id, building_id))

  if (!building) {
    return json({ error: 'Building not found' }, { status: 404 })
  }

  const earned_amount = status === 'completed' ? (building.price_per_clean || 0) : 0
  const cleaned_date = dayjs(date).toDate()

  // Verify if already exists? 
  // For MVP, we assume client handles duplicates or we just insert.
  // Ideally toggle logic handles delete/insert.
  // But "POST" creates. "DELETE" removes log?
  // The user might toggle off -> delete log.
  // Or toggle skipped -> update log.
  // Let's assume this endpoint handles CREATION.
  // If usage implies toggling, client might call DELETE then POST, or strict POST.
  // Let's stick to POST creates.

  const [result] = await db.insert(cleaningLogs).values({
    building_id,
    cleaned_date,
    earned_amount,
    status
  })

  return json({ id: result.insertId }, { status: 201 })
}

export const DELETE = async ({ url, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = url.searchParams.get('id')
  if (!id) {
    return json({ error: 'Missing ID' }, { status: 400 })
  }

  // Ownership check
  const [log] = await db.select().from(cleaningLogs).where(eq(cleaningLogs.id, Number(id)))
  if (!log) return json({ error: 'Not found' }, { status: 404 })

  const [building] = await db.select().from(buildings).where(eq(buildings.id, log.building_id))
  
  if (!building || building.user_id !== locals.user.id) {
     return json({ error: 'Unauthorized' }, { status: 403 })
  }
  
  await db.delete(cleaningLogs).where(eq(cleaningLogs.id, Number(id)))
  
  return json({ success: true })
}
