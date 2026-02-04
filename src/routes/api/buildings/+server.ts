import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { buildings } from '$lib/server/db/schema'
import { eq, isNull, and, desc, sql } from 'drizzle-orm'

export const GET = async ({ url, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const page = Number(url.searchParams.get('page')) || 1
  const limit = Number(url.searchParams.get('limit')) || 5
  const offset = (page - 1) * limit

  // Get total count
  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(buildings)
    .where(and(eq(buildings.user_id, locals.user.id), isNull(buildings.deleted_at)))

  const total = countResult.count

  const data = await db
    .select({
      id: buildings.id,
      name: buildings.name,
      address: buildings.address,
      apiName: buildings.api_name,
      apiAddress: buildings.api_address,
      lat: buildings.lat,
      lng: buildings.lng,
      pricePerClean: buildings.price_per_clean,
      scheduledDays: buildings.scheduled_days,
      createdAt: buildings.created_at
    })
    .from(buildings)
    .where(and(eq(buildings.user_id, locals.user.id), isNull(buildings.deleted_at)))
    .orderBy(desc(buildings.created_at))
    .limit(limit)
    .offset(offset)

  const hasNextPage = offset + limit < total

  return json({
    data,
    total,
    nextPage: hasNextPage ? page + 1 : undefined
  })
}

export const POST = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, address, pricePerClean, scheduledDays, apiName, apiAddress, lat, lng } = body

  if (!name) {
    return json({ error: 'Name is required' }, { status: 400 })
  }

  const [result] = await db.insert(buildings).values({
    user_id: locals.user.id,
    name,
    address,
    api_name: apiName,
    api_address: apiAddress,
    lat,
    lng,
    price_per_clean: pricePerClean || 0,
    scheduled_days: scheduledDays
  })

  // Fetch the created record to return it
  const [created] = await db
    .select({
      id: buildings.id,
      name: buildings.name,
      address: buildings.address,
      apiName: buildings.api_name,
      apiAddress: buildings.api_address,
      lat: buildings.lat,
      lng: buildings.lng,
      pricePerClean: buildings.price_per_clean,
      scheduledDays: buildings.scheduled_days,
      createdAt: buildings.created_at
    })
    .from(buildings)
    .where(eq(buildings.id, result.insertId))

  return json(created, { status: 201 })
}
