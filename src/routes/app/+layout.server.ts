import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user || !locals.session) {
    throw redirect(302, '/')
  }

  return {
    user: locals.user
  }
}
