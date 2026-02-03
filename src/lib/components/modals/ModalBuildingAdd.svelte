<script lang="ts">
  import { X, Trash2 } from 'lucide-svelte'
  import { ui } from '$lib/store/ui.svelte'
  import { t } from '$lib/i18n'
  import { invalidateAll } from '$app/navigation'
  import { useQueryClient } from '@tanstack/svelte-query'
  import ModalConfirm from './ModalConfirm.svelte'

  interface Props {
    building?: {
      id: number
      name: string
      address: string | null
      price_per_clean: number | null
      scheduled_days: string | null
    }
  }

  let { building }: Props = $props()

  const queryClient = useQueryClient()

  let name = $state('')
  let address = $state('')
  let price = $state(0)

  // Use numeric values 0 (Sun) - 6 (Sat)
  let days: number[] = $state([])

  $effect(() => {
    if (building) {
      name = building.name
      address = building.address || ''
      price = building.price_per_clean || 0
      days = building.scheduled_days ? building.scheduled_days.split(',').map(Number) : []
    } else {
      name = ''
      address = ''
      price = 0
      days = []
    }
  })

  const dayOptions = [
    { label: t('building.days_option.0'), value: 0 },
    { label: t('building.days_option.1'), value: 1 },
    { label: t('building.days_option.2'), value: 2 },
    { label: t('building.days_option.3'), value: 3 },
    { label: t('building.days_option.4'), value: 4 },
    { label: t('building.days_option.5'), value: 5 },
    { label: t('building.days_option.6'), value: 6 }
  ]

  const toggleDay = (val: number) => {
    if (days.includes(val)) {
      days = days.filter((x) => x !== val)
    } else {
      days = [...days, val].sort((a, b) => a - b)
    }
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    if (!name) return

    const method = building ? 'PUT' : 'POST'
    const url = building ? `/api/buildings/${building.id}` : '/api/buildings'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        address,
        price_per_clean: price,
        scheduled_days: days.join(',')
      })
    })

    if (res.ok) {
      ui.toast.show({
        text: building ? t('common.toast.saved') : t('common.toast.added'),
        type: 'success'
      })
      ui.modal.close()
      invalidateAll()
      queryClient.invalidateQueries({ queryKey: ['quests'] })
      queryClient.invalidateQueries({ queryKey: ['revenue'] })
    } else {
      ui.toast.show({ text: t('common.toast.error'), type: 'error' })
    }
  }

  const onDeleteClick = () => {
    if (!building) return

    ui.modal.show({
      component: ModalConfirm,
      props: {
        title: t('building.confirm_delete.title'),
        message: t('building.confirm_delete.message'),
        confirmText: t('common.delete'),
        cancelText: t('common.cancel'),
        isDanger: true,
        onConfirm: async () => {
          const res = await fetch(`/api/buildings/${building.id}`, {
            method: 'DELETE'
          })

          if (res.ok) {
            ui.toast.show({ text: t('common.toast.deleted'), type: 'success' })
            ui.modal.close()
            invalidateAll()
            queryClient.invalidateQueries({ queryKey: ['quests'] })
            queryClient.invalidateQueries({ queryKey: ['revenue'] })
          } else {
            ui.toast.show({ text: t('common.toast.error'), type: 'error' })
          }
        }
      }
    })
  }
</script>

<div class="modal-building-add bg-base-100 relative w-full p-6">
  <div class="mb-6 flex items-center justify-between">
    <h2 class="text-base-content text-xl font-bold">
      {building ? t('building.edit') : t('building.add')}
    </h2>
    <button
      type="button"
      onclick={() => ui.modal.close()}
      class="text-sub-content hover:text-base-content cursor-pointer p-1"
    >
      <X />
    </button>
  </div>

  <form onsubmit={handleSubmit} class="space-y-4">
    <div>
      <label class="text-base-content mb-1 block text-sm font-medium">{t('building.name')}</label>
      <input
        type="text"
        bind:value={name}
        placeholder={t('building.placeholder.name')}
        class="border-base bg-base-100 text-base-content placeholder:text-sub-content w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <div>
      <label class="text-base-content mb-1 block text-sm font-medium">{t('building.address')}</label
      >
      <input
        type="text"
        bind:value={address}
        placeholder={t('building.placeholder.address')}
        class="border-base bg-base-100 text-base-content placeholder:text-sub-content w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <div>
      <label class="text-base-content mb-1 block text-sm font-medium">{t('building.price')}</label>
      <div class="relative">
        <input
          type="number"
          bind:value={price}
          class="border-base bg-base-100 text-base-content placeholder:text-sub-content w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <span class="text-sub-content absolute top-3.5 right-4">{t('common.unit_won')}</span>
      </div>
      <div class="mt-2 flex gap-2 overflow-x-auto">
        {#each [10000, 50000, 100000] as amount}
          <button
            type="button"
            onclick={() => (price += amount)}
            class="bg-base-200 text-sub-content rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            +{amount.toLocaleString()}
          </button>
        {/each}
      </div>
    </div>

    <div>
      <label class="text-base-content mb-2 block text-sm font-medium">{t('building.days')}</label>
      <div class="flex flex-wrap gap-2">
        {#each dayOptions as d}
          <button
            type="button"
            onclick={() => toggleDay(d.value)}
            class="h-10 w-10 cursor-pointer rounded-full text-sm font-bold transition-colors {days.includes(
              d.value
            )
              ? 'bg-blue-600 text-white'
              : 'bg-base-200 text-sub-content'}"
          >
            {d.label}
          </button>
        {/each}
      </div>
    </div>

    <div class="mt-6 flex gap-3">
      {#if building}
        <button type="button" onclick={onDeleteClick} class="btn-danger flex-1">
          <Trash2 size={18} />
          {t('common.delete')}
        </button>
      {/if}
      <button type="submit" class="btn-primary flex-[2]" disabled={!name}>
        {building ? t('common.edit') : t('common.add')}
      </button>
    </div>
  </form>
</div>
