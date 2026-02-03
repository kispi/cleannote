<script lang="ts">
  import { X, Trash2 } from 'lucide-svelte'
  import { ui } from '$lib/store/ui.svelte'
  import { t } from '$lib/i18n'
  import { korPrice } from '$lib/utils/format'
  import { useUpsertBuilding, useDeleteBuilding } from '$lib/hooks/useBuildings'
  import FormPrice from '$lib/components/ui/FormPrice.svelte'
  import ModalConfirm from './ModalConfirm.svelte'

  interface Props {
    building?: {
      id: number
      name: string
      address: string | null
      pricePerClean: number | null
      scheduledDays: string | null
    }
  }

  let { building }: Props = $props()

  const upsertMutation = useUpsertBuilding()
  const deleteMutation = useDeleteBuilding()

  let name = $state('')
  let address = $state('')
  let price = $state(0)

  // Use numeric values 0 (Sun) - 6 (Sat)
  let days: number[] = $state([])

  $effect(() => {
    if (building) {
      name = building.name
      address = building.address || ''
      price = building.pricePerClean || 0
      days = building.scheduledDays ? building.scheduledDays.split(',').map(Number) : []
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

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    if (!name) return

    upsertMutation.mutate({
      id: building?.id,
      name,
      address,
      pricePerClean: price,
      scheduledDays: days.join(',')
    })
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
          deleteMutation.mutate(building!.id)
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
      class="text-sub-content hover:bg-base-200 hover:text-base-content cursor-pointer rounded-full p-2 transition-colors"
    >
      <X size={20} />
    </button>
  </div>

  <form onsubmit={handleSubmit} class="space-y-4">
    <!-- ... name/address inputs ... -->
    <div>
      <label for="name" class="text-base-content mb-2 block text-sm font-medium"
        >{t('building.name')}</label
      >
      <input
        type="text"
        bind:value={name}
        placeholder={t('building.placeholder.name')}
        class="border-base bg-base-100 text-base-content placeholder:text-sub-content w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <div>
      <label for="address" class="text-base-content mb-2 block text-sm font-medium"
        >{t('building.address')}</label
      >
      <input
        type="text"
        bind:value={address}
        placeholder={t('building.placeholder.address')}
        class="border-base bg-base-100 text-base-content placeholder:text-sub-content w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <div>
      <FormPrice bind:value={price} label={t('building.price')} id="price" placeholder="0" />
    </div>

    <div>
      <label for="days" class="text-base-content mb-2 block text-sm font-medium"
        >{t('building.days')}</label
      >
      <div class="flex flex-wrap gap-2">
        {#each dayOptions as d}
          <button
            type="button"
            onclick={() => toggleDay(d.value)}
            class="h-10 w-10 cursor-pointer rounded-full text-sm font-bold transition-colors {days.includes(
              d.value
            )
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-base-200 text-sub-content hover:bg-gray-300 dark:hover:bg-gray-600'}"
          >
            {d.label}
          </button>
        {/each}
      </div>
    </div>

    <div class="mt-6 flex gap-3">
      {#if building}
        <button
          type="button"
          onclick={onDeleteClick}
          class="btn-danger flex-1"
          disabled={deleteMutation.isPending}
        >
          <Trash2 size={18} />
          {t('common.delete')}
        </button>
      {/if}
      <button
        type="submit"
        class="btn-primary flex-[2]"
        disabled={!name || upsertMutation.isPending}
      >
        {building ? t('common.edit') : t('common.add')}
      </button>
    </div>
  </form>
</div>
