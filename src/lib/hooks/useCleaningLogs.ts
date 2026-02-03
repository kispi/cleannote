import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query'
import { ui } from '$lib/store/ui.svelte'
import { t } from '$lib/i18n'

export const useCleaningLogs = (limit = 20) => createQuery(() => ({
  queryKey: ['cleaning-logs'],
  queryFn: async () => {
    const res = await fetch(`/api/cleaning-logs?limit=${limit}`)
    if (!res.ok) throw new Error('Failed to fetch logs')
    return res.json()
  }
}))


export const useCreateCleaningLog = () => {
  const queryClient = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (data: any) => {
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
