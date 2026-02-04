import { createQuery, createMutation, useQueryClient, createInfiniteQuery } from '@tanstack/svelte-query'
import { ui } from '$lib/store/ui.svelte'
import { t } from '$lib/i18n'
import type { CleaningLog, CleaningLogUpsert } from '$lib/types/cleaningLog'

export const useCleaningLogs = () => createInfiniteQuery(() => ({
  queryKey: ['cleaning-logs', 'list'],
  queryFn: async ({ pageParam = 1 }) => {
    const res = await fetch(`/api/cleaning-logs?page=${pageParam}&limit=20`)
    if (!res.ok) throw new Error('Failed to fetch logs')
    return res.json()
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage: any) => lastPage.nextPage
}))


export const useCreateCleaningLog = () => {
  const queryClient = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (data: CleaningLogUpsert) => {
      const res = await fetch('/api/cleaning-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error()
      return res.json()
    },
    onSuccess: () => {
        ui.toast.show({ text: t('common.toast.saved'), type: 'success' })
        ui.modal.close()
        queryClient.invalidateQueries({ queryKey: ['cleaning-logs'] })
        queryClient.invalidateQueries({ queryKey: ['revenue'] })
    },
    onError: () => {
      ui.toast.show({ text: t('common.toast.error'), type: 'error' })
    }
  }))
}

export const useDeleteCleaningLog = () => {
  const queryClient = useQueryClient()
  
  return createMutation(() => ({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/cleaning-logs/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cleaning-logs'] })
      queryClient.invalidateQueries({ queryKey: ['revenue'] })
    },
    onError: () => {
      ui.toast.show({ text: t('common.toast.error'), type: 'error' })
    }
  }))
}

export const useUpdateCleaningLog = () => {
  const queryClient = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (data: CleaningLogUpsert & { id: number }) => {
      const { id, ...body } = data
      const res = await fetch(`/api/cleaning-logs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error()
      return res.json()
    },
    onSuccess: () => {
        ui.toast.show({ text: t('common.toast.saved'), type: 'success' })
        ui.modal.close()
        queryClient.invalidateQueries({ queryKey: ['cleaning-logs'] })
        queryClient.invalidateQueries({ queryKey: ['revenue'] })
    },
    onError: () => {
      ui.toast.show({ text: t('common.toast.error'), type: 'error' })
    }
  }))
}
