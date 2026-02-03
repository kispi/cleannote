import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { buildings } from '$lib/server/db/schema'
import { eq, isNull, and, desc } from 'drizzle-orm'

export const GET = async ({ locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await db
    .select()
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
  const { name, address, price_per_clean, scheduled_days } = body

  if (!name) {
    return json({ error: 'Name is required' }, { status: 400 })
  }

  const [result] = await db.insert(buildings).values({
    user_id: locals.user.id,
    name,
    address,
    price_per_clean: price_per_clean || 0,
    scheduled_days
  })

  // Fetch the created record to return it
  const [created] = await db.select().from(buildings).where(eq(buildings.id, result.insertId))

  return json(created, { status: 201 })
}
