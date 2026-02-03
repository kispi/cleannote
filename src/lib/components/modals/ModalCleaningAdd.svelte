<script lang="ts">
  import { X, Sparkles } from 'lucide-svelte'
  import { ui } from '$lib/store/ui.svelte'
  import { t } from '$lib/i18n'
  import { useQueryClient } from '@tanstack/svelte-query'
  import dayjs from 'dayjs'
  import Dropdown from '$lib/components/ui/Dropdown.svelte'

  interface Props {
    buildings: any[] // passed from parent
  }

  let { buildings }: Props = $props()

  const queryClient = useQueryClient()

  let selectedBuildingId = $state<number | null>(null)

  // Default to today
  let date = $state(dayjs().format('YYYY-MM-DD'))
  // Default time? Maybe current time rounded? or just empty?
  // User suggestion: "ex: 14:00".
  let time = $state(dayjs().format('HH:mm'))

  const currentDay = dayjs().day()

  let buildingOptions = $derived(
    buildings
      .map((b) => {
        const scheduled = b.scheduled_days ? b.scheduled_days.split(',').map(Number) : []
        const isToday = scheduled.includes(currentDay)
        return {
          value: b.id,
          label: b.name,
          address: b.address,
          price: b.price_per_clean,
          isToday
        }
      })
      .sort((a, b) => Number(b.isToday) - Number(a.isToday))
  )

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    if (!selectedBuildingId || !date || !time) return

    // Construct ISO string
    // Combine YYYY-MM-DD and HH:mm
    const clean_start = dayjs(`${date} ${time}`).toISOString()

    const res = await fetch('/api/cleaning-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        building_id: selectedBuildingId,
        clean_start,
        status: 'completed'
      })
    })

    if (res.ok) {
      ui.toast.show({ text: t('common.toast.saved'), type: 'success' })
      ui.modal.close()
      queryClient.invalidateQueries({ queryKey: ['quests'] })
      queryClient.invalidateQueries({ queryKey: ['revenue'] })
    } else {
      ui.toast.show({ text: t('common.toast.error'), type: 'error' })
    }
  }
</script>

<div class="modal-cleaning-add bg-base-100 relative w-full p-6">
  <div class="mb-6 flex items-center justify-between">
    <h2 class="text-base-content text-xl font-bold">
      {t('cleaning.add_record')}
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
    <!-- Building Select -->
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">{t('building.name')}</label>
      <Dropdown
        bind:value={selectedBuildingId}
        options={buildingOptions}
        placeholder={t('building.name')}
      >
        {#snippet renderOption(opt)}
          <div class="flex w-full flex-col items-start gap-1 py-1">
            <div class="flex w-full items-center justify-between">
              <span class="font-medium text-gray-700 dark:text-gray-200">{opt.label}</span>
              {#if opt.isToday}
                <span
                  class="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                >
                  <Sparkles size={10} />
                  TODAY
                </span>
              {/if}
            </div>

            <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{opt.address || t('building.placeholder.address')}</span>
              {#if opt.price}
                <span>• {opt.price.toLocaleString()}{t('common.unit_won')}</span>
              {/if}
            </div>
          </div>
        {/snippet}
      </Dropdown>
    </div>

    <!-- Date -->
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">{t('common.date')}</label>
      <input
        type="date"
        bind:value={date}
        class="w-full rounded-xl border border-gray-200 px-4 py-3 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <!-- Time -->
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700">{t('common.time')}</label>
      <input
        type="time"
        bind:value={time}
        class="w-full rounded-xl border border-gray-200 px-4 py-3 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <div class="mt-6">
      <button
        type="submit"
        class="btn-primary w-full"
        disabled={!selectedBuildingId || !date || !time}
      >
        {t('common.add')}
      </button>
    </div>
  </form>
</div>
