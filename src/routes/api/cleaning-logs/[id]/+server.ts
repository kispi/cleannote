import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { cleaningLogs, buildings } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'

import dayjs from 'dayjs'

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
  const { buildingId, cleanStart, cleanEnd, status, earnedAmount } = body

  const [log] = await db.select().from(cleaningLogs).where(eq(cleaningLogs.id, Number(id)))
  if (!log) return json({ error: 'Not found' }, { status: 404 })

  // Validate ownership via building
  const [existingBuilding] = await db.select().from(buildings).where(eq(buildings.id, log.building_id))
  if (!existingBuilding || existingBuilding.user_id !== locals.user.id) {
     return json({ error: 'Unauthorized' }, { status: 403 })
  }

  // If changing building, check new building ownership
  if (buildingId && buildingId !== log.building_id) {
    const [newBuilding] = await db.select().from(buildings).where(eq(buildings.id, buildingId))
    if (!newBuilding || newBuilding.user_id !== locals.user.id) {
        return json({ error: 'Invalid building' }, { status: 400 })
    }
  }

  const updates: Partial<typeof cleaningLogs.$inferInsert> = {}
  
  if (buildingId) updates.building_id = buildingId
  if (cleanStart) updates.clean_start = dayjs(cleanStart).toDate()
  if (cleanEnd) updates.clean_end = dayjs(cleanEnd).toDate()
  if (status) updates.status = status
  if (typeof earnedAmount !== 'undefined') updates.earned_amount = earnedAmount

  await db.update(cleaningLogs).set(updates).where(eq(cleaningLogs.id, Number(id)))

  return json({ success: true })
}
