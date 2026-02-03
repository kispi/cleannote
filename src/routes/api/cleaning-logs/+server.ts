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
  const { building_id, clean_start, clean_end, status } = body

  if (!building_id || !clean_start || !status) {
    return json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Calculate earned amount
  const [building] = await db
    .select()
    .from(buildings)
    .where(eq(buildings.id, building_id))

  if (!building) {
    return json({ error: 'Building not found' }, { status: 404 })
  }

  const earned_amount = status === 'completed' ? (building.price_per_clean || 0) : 0
  
  const start = dayjs(clean_start)
  const end = clean_end ? dayjs(clean_end) : start.add(1, 'hour')

  const [result] = await db.insert(cleaningLogs).values({
    building_id,
    clean_start: start.toDate(),
    clean_end: end.toDate(),
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
