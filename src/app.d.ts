// See https://svelte.dev/docs/kit/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: {
        id: number
        email: string | null
        name: string | null
        avatar_url: string | null
      } | null
      session: {
        id: number
        expires_at: Date
      } | null
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
