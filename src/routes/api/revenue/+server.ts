import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { cleaningLogs, buildings } from '$lib/server/db/schema'
import { and, eq, gte, lte, sql } from 'drizzle-orm'
import dayjs from 'dayjs'

export const GET = async ({ url, locals }) => {
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 })
  }

  const monthStr = url.searchParams.get('month') || dayjs().format('YYYY-MM')
  const startOfMonth = dayjs(monthStr).startOf('month').toDate()
  const endOfMonth = dayjs(monthStr).endOf('month').toDate()

  // We need to join with buildings to ensure it belongs to user
  // cleaning_logs -> buildings -> users
  
  const result = await db
    .select({
      totalAmount: sql<number>`sum(${cleaningLogs.earned_amount})`,
      completedCount: sql<number>`count(${cleaningLogs.id})`
    })
    .from(cleaningLogs)
    .innerJoin(buildings, eq(cleaningLogs.building_id, buildings.id))
    .where(
      and(
        eq(buildings.user_id, locals.user.id),
        gte(cleaningLogs.clean_start, startOfMonth),
        lte(cleaningLogs.clean_start, endOfMonth),
        eq(cleaningLogs.status, 'completed')
      )
    )

  const stats = result[0] || { totalAmount: 0, completedCount: 0 }

  return json({
    totalAmount: Number(stats.totalAmount) || 0,
    completedCount: Number(stats.completedCount) || 0
  })
}
