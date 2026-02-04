import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { buildings } from '$lib/server/db/schema'
import { eq, and, isNull } from 'drizzle-orm'

export const GET = async ({ params, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }
  const id = Number(params.id)

  const [building] = await db
    .select()
    .from(buildings)
    .where(and(eq(buildings.id, id), eq(buildings.user_id, locals.user.id), isNull(buildings.deleted_at)))

  if (!building) {
    return json({ error: 'Not found' }, { status: 404 })
  }

  return json(building)
}

export const PUT = async ({ params, request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }
  const id = Number(params.id)
  const body = await request.json()

  // Only allow updating specific fields
  // Only allow updating specific fields
  const { name, address, pricePerClean, scheduledDays, memo, apiName, apiAddress, lat, lng } = body

  const [existing] = await db
    .select()
    .from(buildings)
    .where(and(eq(buildings.id, id), eq(buildings.user_id, locals.user.id), isNull(buildings.deleted_at)))

  if (!existing) {
    return json({ error: 'Not found' }, { status: 404 })
  }

  await db
    .update(buildings)
    .set({
      name,
      address,
      api_name: apiName,
      api_address: apiAddress,
      lat,
      lng,
      price_per_clean: pricePerClean,
      scheduled_days: scheduledDays,
      memo,
      updated_at: new Date()
    })
    .where(eq(buildings.id, id))

  const [updated] = await db.select().from(buildings).where(eq(buildings.id, id))
  return json(updated)
}

export const DELETE = async ({ params, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }
  const id = Number(params.id)

  const [existing] = await db
    .select()
    .from(buildings)
    .where(and(eq(buildings.id, id), eq(buildings.user_id, locals.user.id), isNull(buildings.deleted_at)))

  if (!existing) {
    return json({ error: 'Not found' }, { status: 404 })
  }

  // Soft delete
  await db
    .update(buildings)
    .set({
      deleted_at: new Date()
    })
    .where(eq(buildings.id, id))

  return json({ success: true })
}
