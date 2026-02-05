import { createInfiniteQuery, createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query'
import { ui } from '$lib/store/ui.svelte'
import { t } from '$lib/i18n'
import { invalidateAll } from '$app/navigation'
import type { Building, BuildingUpsert } from '$lib/types/building'

export const useBuildings = () => createInfiniteQuery(() => ({
  queryKey: ['buildings', 'list'],
  queryFn: async ({ pageParam = 1 }) => {
    const res = await fetch(`/api/buildings?page=${pageParam}&limit=20`)
    if (!res.ok) throw new Error('Failed to fetch buildings')
    return res.json()
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage: any) => lastPage.nextPage
}))

export const useAllBuildings = () => createQuery<Building[]>(() => ({
  queryKey: ['buildings', 'all'],
  queryFn: async () => {
    const res = await fetch('/api/buildings?limit=100')
    if (!res.ok) throw new Error('Failed to fetch buildings')
    const json = await res.json()
    // The API returns { data, total, nextPage }
    // We want to return just the array for the dropdown usage
    return json.data || []
  }
}))

export const useUpsertBuilding = (options?: {
  suppressSuccessToast?: boolean
  suppressClose?: boolean
}) => {
  const queryClient = useQueryClient()
  
  return createMutation(() => ({
    mutationFn: async (data: BuildingUpsert) => {
      const isEdit = !!data.id
      const method = isEdit ? 'PUT' : 'POST'
      const url = isEdit ? `/api/buildings/${data.id}` : '/api/buildings'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to upsert building')
      }
      
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] })
      
      if (!options?.suppressSuccessToast) {
        ui.toast.show({
          text: t('common.toast.saved'),
          type: 'success'
        })
      }
      
      if (!options?.suppressClose) {
        ui.modal.close()
      }
      
      invalidateAll()
    },
    onError: (error: any) => {
      ui.toast.show({
        text: error.message,
        type: 'error'
      })
    }
  }))
}

export const useDeleteBuilding = () => {
  const queryClient = useQueryClient()

  return createMutation(() => ({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/buildings/${id}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) {
        throw new Error('Failed to delete building')
      }
      
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] })
      ui.toast.show({
        text: t('common.toast.saved'),
        type: 'success'
      })
      ui.modal.close()
      invalidateAll()
    },
    onError: (error: any) => {
      ui.toast.show({
        text: error.message,
        type: 'error'
      })
    }
  }))
}
