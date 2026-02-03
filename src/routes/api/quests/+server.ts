import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { buildings, cleaningLogs } from '$lib/server/db/schema'
import { and, eq, isNull, gte, lte } from 'drizzle-orm'
import dayjs from 'dayjs'

export const GET = async ({ url, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dateStr = url.searchParams.get('date') || dayjs().format('YYYY-MM-DD')
  const date = dayjs(dateStr)
  const dayOfWeek = date.day() // 0 (Sun) - 6 (Sat)

  // 1. Get ALL active buildings
  const allBuildings = await db
    .select()
    .from(buildings)
    .where(and(eq(buildings.user_id, locals.user.id), isNull(buildings.deleted_at)))

  // 2. Get cleaning logs for this date
  const startOfDay = date.startOf('day').toDate()
  const endOfDay = date.endOf('day').toDate()

  const logs = await db
    .select()
    .from(cleaningLogs)
    .where(
      and(
        gte(cleaningLogs.clean_start, startOfDay),
        lte(cleaningLogs.clean_start, endOfDay)
      )
    )

  // 3. Map and Merge
  const result = allBuildings.map((b) => {
    const log = logs.find((l) => l.building_id === b.id)
    
    let is_scheduled = false
    if (b.scheduled_days) {
      const days = b.scheduled_days.split(',').map(Number)
      if (days.includes(dayOfWeek)) is_scheduled = true
    }

    return {
      building: b,
      status: log ? log.status : 'pending',
      log_id: log ? log.id : null,
      is_scheduled
    }
  })

  // Optional: Sort by scheduled first? 
  // Let client handle UI grouping.

  return json(result)
}
