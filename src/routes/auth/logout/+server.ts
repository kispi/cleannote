import { redirect } from '@sveltejs/kit'
import { deleteSessionCookie, invalidateSession } from '$lib/server/auth'

export const POST = async ({ cookies }) => {
  const sessionToken = cookies.get('auth_session')
  if (sessionToken) {
    await invalidateSession(sessionToken)
  }
  deleteSessionCookie({ cookies } as any)
  throw redirect(302, '/')
}
