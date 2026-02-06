
import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { cleaningLogs, buildings } from '$lib/server/db/schema'
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm'
import dayjs from 'dayjs'

export const POST = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { buildingId, cleanStart, cleanEnd, status, earnedAmount } = body

  if (!buildingId || !cleanStart || !status) {
    return json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Fetch building to get price and creating snapshot
  let buildingSnapshot = null
  let building = null

  if (buildingId) {
     const [b] = await db.select().from(buildings).where(eq(buildings.id, buildingId))
     building = b
     if (b) {
       buildingSnapshot = {
         name: b.name,
         address: b.address,
         pricePerClean: b.price_per_clean,
         apiName: b.api_name,
         apiAddress: b.api_address,
         lat: b.lat,
         lng: b.lng
       }
     }
  }

  if (!building) {
      return json({ error: 'Building not found' }, { status: 404 })
  }

  // Calculate earned amount if not provided
  let earned_amount = earnedAmount
  
  if (typeof earned_amount === 'undefined') {
    earned_amount = status === 'completed' ? (building.price_per_clean || 0) : 0
  }

  const start = dayjs(cleanStart)
  const end = cleanEnd ? dayjs(cleanEnd) : start.add(1, 'hour')

  const [result] = await db.insert(cleaningLogs).values({
    building_id: buildingId,
    clean_start: start.toDate(),
    clean_end: end.toDate(),
    earned_amount,
    status,
    building_snapshot: buildingSnapshot
  })

  return json({ id: result.insertId }, { status: 201 })
}

export const GET = async ({ url, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const limit = Number(url.searchParams.get('limit')) || 20
  const page = Number(url.searchParams.get('page')) || 1
  const startParam = url.searchParams.get('start')
  const endParam = url.searchParams.get('end')
  const offset = (page - 1) * limit
  
  // Build where conditions
  const conditions = [eq(buildings.user_id, locals.user.id)]
  if (startParam) conditions.push(gte(cleaningLogs.clean_start, dayjs(startParam).toDate()))
  if (endParam) conditions.push(lte(cleaningLogs.clean_start, dayjs(endParam).endOf('day').toDate()))
  
  const filter = url.searchParams.get('filter') // 'unpaid', 'overpaid', 'all'
  if (filter === 'unpaid') {
    const condition = and(
      eq(cleaningLogs.status, 'completed'),
      sql`${cleaningLogs.earned_amount} < ${buildings.price_per_clean}`
    )
    if (condition) conditions.push(condition)
  } else if (filter === 'overpaid') {
     const condition = and(
      eq(cleaningLogs.status, 'completed'),
      sql`${cleaningLogs.earned_amount} > ${buildings.price_per_clean}`
    )
    if (condition) conditions.push(condition)
  }

  // Fetch total count
  const totalResult = await db
    .select({ count: cleaningLogs.id })
    .from(cleaningLogs)
    .innerJoin(buildings, eq(cleaningLogs.building_id, buildings.id))
    .where(and(...conditions))
  
  const total = totalResult.length
  
  // Fetch logs with building info
  const logs = await db
    .select({
      id: cleaningLogs.id,
      cleanStart: cleaningLogs.clean_start,
      cleanEnd: cleaningLogs.clean_end,
      earnedAmount: cleaningLogs.earned_amount,
      status: cleaningLogs.status,
      buildingSnapshot: cleaningLogs.building_snapshot,
      building: {
        id: buildings.id,
        name: buildings.name,
        address: buildings.address,
        apiName: buildings.api_name,
        apiAddress: buildings.api_address,
        lat: buildings.lat,
        lng: buildings.lng,
        pricePerClean: buildings.price_per_clean
      }
    })
    .from(cleaningLogs)
    .innerJoin(buildings, eq(cleaningLogs.building_id, buildings.id))
    .where(and(...conditions))
    .orderBy(desc(cleaningLogs.clean_start))
    .limit(limit)
    .offset(offset)

  const nextPage = offset + limit < total ? page + 1 : null

  return json({ data: logs, total, nextPage })
}
