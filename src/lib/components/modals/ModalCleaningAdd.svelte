<script lang="ts">
  import { X, Sparkles } from 'lucide-svelte'
  import { ui } from '$lib/store/ui.svelte'
  import { t } from '$lib/i18n'
  import dayjs from 'dayjs'
  import Dropdown from '$lib/components/ui/Dropdown.svelte'
  import { useCreateCleaningLog, useUpdateCleaningLog } from '$lib/hooks/useCleaningLogs'
  import FormPrice from '$lib/components/ui/FormPrice.svelte'
  import { priceWithSign } from '$lib/utils/format'

  interface Props {
    buildings: any[] // passed from parent
    log?: any // Optional log for editing
  }

  let { buildings, log }: Props = $props()

  const createMutation = useCreateCleaningLog()
  const updateMutation = useUpdateCleaningLog()

  // Initialize state
  let selectedBuildingId = $state<number | null>(log?.building.id || null)
  let earnedAmount = $state<number>(log?.earnedAmount || 0)

  // Track previous building to prevent overwriting earnedAmount on init
  let previousBuildingId = $state<number | null>(log?.building.id || null)

  // Default to today or log date
  let date = $state(log ? dayjs(log.cleanStart).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'))
  let time = $state(log ? dayjs(log.cleanStart).format('HH:mm') : dayjs().format('HH:mm'))

  const currentDay = dayjs().day()

  let buildingOptions = $derived(
    buildings
      .map((b) => {
        const scheduled = b.scheduledDays ? b.scheduledDays.split(',').map(Number) : []
        const isToday = scheduled.includes(currentDay)
        return {
          value: b.id,
          label: b.name,
          address: b.address,
          price: b.pricePerClean,
          isToday
        }
      })
      .sort((a, b) => Number(b.isToday) - Number(a.isToday))
  )

  $effect(() => {
    if (selectedBuildingId && selectedBuildingId !== previousBuildingId) {
      previousBuildingId = selectedBuildingId
      const b = buildings.find((b) => b.id === selectedBuildingId)
      if (b) {
        earnedAmount = b.pricePerClean || 0
      }
    }
  })

  // Initial check for default Create mode (no log) - set default price if user selects valid building first time
  // Actually the above effect handles change. But if I start with null (Create mode), and select a building,
  // previous is null, selected is X. mismatch -> updates price. Correct.

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    if (!selectedBuildingId || !date || !time) return

    const cleanStart = dayjs(`${date} ${time}`).toISOString()
    const payload = {
      buildingId: selectedBuildingId,
      cleanStart,
      earnedAmount,
      status: 'completed'
    }

    if (log) {
      updateMutation.mutate({ id: log.id, ...payload })
    } else {
      createMutation.mutate(payload)
    }
  }
</script>

<div class="modal-cleaning-add bg-base-100 relative w-full p-6">
  <div class="mb-6 flex items-center justify-between">
    <h2 class="text-base-content text-xl font-bold">
      {log ? t('cleaning.edit_record') : t('cleaning.add_record')}
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
    <!-- Building Select -->
    <div>
      <label for="building_id" class="text-base-content mb-2 block text-sm font-medium"
        >{t('building.name')}</label
      >
      <Dropdown
        bind:value={selectedBuildingId}
        options={buildingOptions}
        placeholder={t('building.name')}
      >
        {#snippet renderOption(opt)}
          <div class="flex w-full flex-col items-start gap-1 py-1">
            <div class="flex w-full items-center justify-between">
              <span class="text-base-content font-medium">{opt.label}</span>
              {#if opt.isToday}
                <span
                  class="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                >
                  <Sparkles size={10} />
                  TODAY
                </span>
              {/if}
            </div>

            <div class="flex items-center gap-2 text-xs text-gray-500">
              <span>{opt.address || t('building.placeholder.address')}</span>
              {#if opt.price}
                <span>• {priceWithSign(opt.price)}</span>
              {/if}
            </div>
          </div>
        {/snippet}
      </Dropdown>
    </div>

    <!-- Date -->
    <div>
      <label for="date" class="text-base-content mb-2 block text-sm font-medium"
        >{t('common.date')}</label
      >
      <input
        type="date"
        bind:value={date}
        class="w-full rounded-xl border border-gray-200 px-4 py-3 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <!-- Time -->
    <div>
      <label for="time" class="text-base-content mb-2 block text-sm font-medium"
        >{t('common.time')}</label
      >
      <input
        type="time"
        bind:value={time}
        class="w-full rounded-xl border border-gray-200 px-4 py-3 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <!-- Earned Amount -->
    <div>
      <FormPrice bind:value={earnedAmount} label={t('home.monthly_revenue')} id="earned_amount" />
    </div>

    <div class="mt-6">
      <button
        type="submit"
        class="btn-primary w-full"
        disabled={!selectedBuildingId || !date || !time}
      >
        {log ? t('common.save') : t('common.add')}
      </button>
    </div>
  </form>
</div>
