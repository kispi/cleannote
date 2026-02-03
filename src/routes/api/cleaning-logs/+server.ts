import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { cleaningLogs, buildings } from '$lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
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

export const GET = async ({ url, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const limit = Number(url.searchParams.get('limit')) || 20
  
  // Fetch logs with building info
  // ordered by clean_start desc
  const logs = await db
    .select({
      id: cleaningLogs.id,
      clean_start: cleaningLogs.clean_start,
      clean_end: cleaningLogs.clean_end,
      earned_amount: cleaningLogs.earned_amount,
      status: cleaningLogs.status,
      building: {
        id: buildings.id,
        name: buildings.name,
        address: buildings.address,
        price_per_clean: buildings.price_per_clean
      }
    })
    .from(cleaningLogs)
    .innerJoin(buildings, eq(cleaningLogs.building_id, buildings.id))
    .where(eq(buildings.user_id, locals.user.id))
    .orderBy(desc(cleaningLogs.clean_start)) // clean_start is likely better than created_at for sorting logs
    .limit(limit)

  return json(logs)
}
