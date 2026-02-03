import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query'
import { ui } from '$lib/store/ui.svelte'
import { t } from '$lib/i18n'
import { invalidateAll } from '$app/navigation'

export const useBuildings = () => createQuery(() => ({
  queryKey: ['buildings'],
  queryFn: async () => {
    const res = await fetch('/api/buildings')
    if (!res.ok) throw new Error('Failed to fetch buildings')
    return res.json()
  }
}))

export const useUpsertBuilding = () => {
  const queryClient = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (data: any) => {
      const method = data.id ? 'PUT' : 'POST'
      const url = data.id ? `/api/buildings/${data.id}` : '/api/buildings'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) throw new Error()
      return res.json()
    },
    onSuccess: (data, variables) => {
      ui.toast.show({
        text: variables.id ? t('common.toast.saved') : t('common.toast.added'),
        type: 'success'
      })
      ui.modal.close()
      invalidateAll()
      queryClient.invalidateQueries({ queryKey: ['buildings'] }) // Also invalidate 'buildings'
      queryClient.invalidateQueries({ queryKey: ['revenue'] })
    },
    onError: () => {
      ui.toast.show({ text: t('common.toast.error'), type: 'error' })
    }
  }))
}

export const useDeleteBuilding = () => {
  const queryClient = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/buildings/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      return { success: true }
    },
    onSuccess: () => {
      ui.toast.show({ text: t('common.toast.deleted'), type: 'success' })
      ui.modal.close()
      invalidateAll()
      queryClient.invalidateQueries({ queryKey: ['buildings'] })
      queryClient.invalidateQueries({ queryKey: ['revenue'] })
    },
    onError: () => {
      ui.toast.show({ text: t('common.toast.error'), type: 'error' })
    }
  }))
}
