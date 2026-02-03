import { db } from './db'
import { sessions, users } from './db/schema'
import { eq } from 'drizzle-orm'
import { type RequestEvent } from '@sveltejs/kit'

const SESSION_COOKIE_NAME = 'auth_session'
const ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7

export const createSession = async (userId: number) => {
  const sessionToken = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + ONE_WEEK_MS)

  await db.insert(sessions).values({
    user_id: userId,
    session_token: sessionToken,
    expires_at: expiresAt
  })

  return { sessionToken, expiresAt }
}

export const validateSession = async (token: string) => {
  const [session] = await db
    .select({
      user: users,
      session: sessions
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.user_id))
    .where(eq(sessions.session_token, token))

  if (!session) return null

  if (Date.now() >= session.session.expires_at.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, session.session.id))
    return null
  }

  // Renew session if close to expiry (optional optimization: e.g. < 1 day left)
  // For simplicity, just return valid session
  return session
}

export const invalidateSession = async (token: string) => {
  await db.delete(sessions).where(eq(sessions.session_token, token))
}

export const setSessionCookie = (event: RequestEvent, token: string, expires: Date) => {
  event.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    path: '/',
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    expires: expires
  })
}

export const deleteSessionCookie = (event: RequestEvent) => {
  event.cookies.delete(SESSION_COOKIE_NAME, { path: '/' })
}
