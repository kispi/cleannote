import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { cleaningLogs, buildings } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'

export const DELETE = async ({ params, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  if (!id) {
    return json({ error: 'Missing ID' }, { status: 400 })
  }

  // Ownership check
  const [log] = await db.select().from(cleaningLogs).where(eq(cleaningLogs.id, Number(id)))
  if (!log) return json({ error: 'Not found' }, { status: 404 })

  const [building] = await db.select().from(buildings).where(eq(buildings.id, log.building_id))
  
  // Ensure the user owns the building associated with the log
  if (!building || building.user_id !== locals.user.id) {
     return json({ error: 'Unauthorized' }, { status: 403 })
  }
  
  await db.delete(cleaningLogs).where(eq(cleaningLogs.id, Number(id)))
  
  return json({ success: true })
}

export const PUT = async ({ params, request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const body = await request.json()
  
  // TODO: Add validation and update logic if needed
  // For now, adhering to the structure but no specific PUT logic was requested detailedly, 
  // but strictly strictly following "DELETE, PUT ... query param -> url param"
  
  return json({ message: "Not implemented yet" })
}
