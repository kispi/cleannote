import { validateSession } from '$lib/server/auth'
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
    } else {
      event.locals.user = null
      event.locals.session = null
    }
  } catch (err) {
    console.error('Session validation error:', err)
    event.locals.user = null
    event.locals.session = null
  }

  return resolve(event)
}
