import { validateSession, updateSession, setSessionCookie } from '$lib/server/auth'
import { type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get('auth_session')

  if (!sessionToken) {
    event.locals.user = null
    event.locals.session = null
    return resolve(event)
  }

  try {
    const result = await validateSession(sessionToken)

    if (result) {
      event.locals.user = result.user
      event.locals.session = result.session

      // Sliding session: if less than 15 days left (half of 30 days), renew
      const fifteenDaysMs = 1000 * 60 * 60 * 24 * 15
      if (result.session.expires_at.getTime() - Date.now() < fifteenDaysMs) {
        const newExpiresAt = await updateSession(result.session.id)
        setSessionCookie(event, sessionToken, newExpiresAt)
      }
    } else {
      event.locals.user = null
      event.locals.session = null
      // Clear invalid cookie
      event.cookies.delete('auth_session', { path: '/' })
    }
  } catch (err) {
    console.error('Session validation error:', err)
    event.locals.user = null
    event.locals.session = null
  }

  return resolve(event)
}
