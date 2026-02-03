import { createQuery } from '@tanstack/svelte-query'

export const useRevenue = (month: string) => createQuery(() => ({
  queryKey: ['revenue', month],
  queryFn: async () => {
    const res = await fetch(`/api/revenue?month=${month}`)
    if (!res.ok) throw new Error('Failed to fetch revenue')
    return res.json()
  }
}))
