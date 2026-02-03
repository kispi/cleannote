import { redirect, error } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { db } from '$lib/server/db'
import { accounts, users } from '$lib/server/db/schema'
import { createSession, setSessionCookie } from '$lib/server/auth'
import { eq, and } from 'drizzle-orm'

export const GET = async ({ url, cookies }) => {
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const storedState = cookies.get('oauth_state')

  if (!code || !state || state !== storedState) {
    throw error(400, 'Invalid request')
  }
  cookies.delete('oauth_state', { path: '/' })

  const REDIRECT_URI = `${url.origin}/auth/kakao/callback`
  const KAKAO_CLIENT_ID = env.KAKAO_CLIENT_ID

  // 1. Get Access Token
  const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: KAKAO_CLIENT_ID!,
      redirect_uri: REDIRECT_URI,
      code
    })
  })
  const tokenData = await tokenResponse.json()

  // 2. Get User Info
  const userResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  })
  const userData = await userResponse.json()

  if (!userData.id) throw error(500, 'Failed to get Kakao user')

  const kakaoId = userData.id.toString()
  const nickname = userData.properties?.nickname || 'User'
  const email = userData.kakao_account?.email || null
  const avatar = userData.properties?.profile_image || null

  // 3. Find or Create User
  let userId: number

  const [existingAccount] = await db
    .select()
    .from(accounts)
    .where(and(eq(accounts.provider, 'kakao'), eq(accounts.provider_account_id, kakaoId)))

  if (existingAccount) {
    userId = existingAccount.user_id
    // Update tokens
    await db
      .update(accounts)
      .set({
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000)
      })
      .where(eq(accounts.id, existingAccount.id))
  } else {
    // New User
    const [result] = await db.insert(users).values({
      name: nickname,
      email: email,
      avatar_url: avatar
    })
    userId = result.insertId

    await db.insert(accounts).values({
      user_id: userId,
      provider: 'kakao',
      provider_account_id: kakaoId,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token
    })
  }

  // 4. Create Session
  const { sessionToken, expiresAt } = await createSession(userId)
  setSessionCookie({ cookies } as any, sessionToken, expiresAt)

  // Return HTML to close popup and redirect opener
  return new Response(
    `
    <html>
      <head>
        <script>
          if (window.opener) {
            window.opener.location.href = '/app';
            window.close();
          } else {
            window.location.href = '/app';
          }
        </script>
      </head>
      <body>
        <p>로그인 성공! 잠시만 기다려주세요...</p>
      </body>
    </html>
    `,
    {
      headers: { 'Content-Type': 'text/html' }
    }
  );
}
