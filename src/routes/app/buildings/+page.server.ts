import { db } from '$lib/server/db'
import { buildings } from '$lib/server/db/schema'
import { eq, and, isNull, desc } from 'drizzle-orm'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) return { buildings: [] }

  const list = await db
    .select()
    .from(buildings)
    .where(and(eq(buildings.user_id, locals.user.id), isNull(buildings.deleted_at)))
    .orderBy(desc(buildings.created_at))

  return { buildings: list }
}
