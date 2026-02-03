import { json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { users } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'

export const PUT = async ({ request, locals }) => {
  if (!locals.user) return json({ success: false }, { status: 401 })
  
  const { name } = await request.json()
  if (!name || name.length < 1) return json({ success: false, message: 'Invalid name' }, { status: 400 })

  await db.update(users).set({ name }).where(eq(users.id, locals.user.id))
  
  return json({ success: true })
}
