import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { buildings } from '$lib/server/db/schema'
import { eq, isNull, and, desc } from 'drizzle-orm'

export const GET = async ({ locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await db
    .select({
      id: buildings.id,
      name: buildings.name,
      address: buildings.address,
      pricePerClean: buildings.price_per_clean,
      scheduledDays: buildings.scheduled_days,
      createdAt: buildings.created_at
    })
    .from(buildings)
    .where(and(eq(buildings.user_id, locals.user.id), isNull(buildings.deleted_at)))
    .orderBy(desc(buildings.created_at))

  return json(data)
}

export const POST = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, address, pricePerClean, scheduledDays } = body

  if (!name) {
    return json({ error: 'Name is required' }, { status: 400 })
  }

  const [result] = await db.insert(buildings).values({
    user_id: locals.user.id,
    name,
    address,
    price_per_clean: pricePerClean || 0,
    scheduled_days: scheduledDays
  })

  // Fetch the created record to return it
  const [created] = await db
    .select({
      id: buildings.id,
      name: buildings.name,
      address: buildings.address,
      pricePerClean: buildings.price_per_clean,
      scheduledDays: buildings.scheduled_days,
      createdAt: buildings.created_at
    })
    .from(buildings)
    .where(eq(buildings.id, result.insertId))

  return json(created, { status: 201 })
}
