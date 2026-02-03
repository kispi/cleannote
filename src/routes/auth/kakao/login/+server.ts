import { redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'

export const GET = async ({ url, cookies }) => {
  const KAKAO_CLIENT_ID = env.KAKAO_CLIENT_ID
  const REDIRECT_URI = `${url.origin}/auth/kakao/callback`

  if (!KAKAO_CLIENT_ID) {
    throw new Error('KAKAO_CLIENT_ID is not set')
  }

  const state = crypto.randomUUID()
  cookies.set('oauth_state', state, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    maxAge: 60 * 10 
  })

  const target = new URL('https://kauth.kakao.com/oauth/authorize')
  target.searchParams.set('client_id', KAKAO_CLIENT_ID)
  target.searchParams.set('redirect_uri', REDIRECT_URI)
  target.searchParams.set('response_type', 'code')
  target.searchParams.set('state', state)

  throw redirect(302, target.toString())
}
