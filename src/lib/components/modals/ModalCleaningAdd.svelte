<script lang="ts">
  import { X, Sparkles, Trash2 } from 'lucide-svelte'
  import { ui } from '$lib/store/ui.svelte'
  import { t } from '$lib/i18n'
  import dayjs from 'dayjs'
  import Dropdown from '$lib/components/ui/Dropdown.svelte'
  import {
    useCreateCleaningLog,
    useUpdateCleaningLog,
    useDeleteCleaningLog
  } from '$lib/hooks/useCleaningLogs'
  import FormPrice from '$lib/components/ui/FormPrice.svelte'
  import { priceWithSign } from '$lib/utils/format'
  import ModalConfirm from './ModalConfirm.svelte'
  import type { Building, CleaningLog, CleaningLogUpsert } from '$lib/types'
  import BuildingAddress from '$lib/components/ui/BuildingAddress.svelte'

  interface Props {
    buildings: Building[]
    log?: CleaningLog
  }

  let { buildings, log }: Props = $props()

  const createMutation = useCreateCleaningLog()
  const updateMutation = useUpdateCleaningLog()
  const deleteMutation = useDeleteCleaningLog()

  const handleDelete = () => {
    if (!log?.id) return
    ui.modal.show({
      component: ModalConfirm,
      props: {
        title: t('cleaning.delete_confirm.title'),
        message: t('cleaning.delete_confirm.message'),
        isDanger: true,
        confirmText: t('common.delete'),
        onConfirm: async () => {
          deleteMutation.mutate(log.id)
        }
      }
    })
  }

  // Initialize state
  let selectedBuildingId = $state<number | null>(log?.building?.id || null)
  let earnedAmount = $state<number>(log?.earnedAmount || 0)

  // Track previous building to prevent overwriting earnedAmount on init
  let previousBuildingId = $state<number | null>(log?.building?.id || null)

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
          building: b,
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
    const payload: CleaningLogUpsert = {
      buildingId: selectedBuildingId,
      cleanStart,
      cleanEnd: cleanStart, // Default same as start
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

            <div class="flex w-full items-center justify-between">
              <div class="min-w-0 flex-1">
                <BuildingAddress building={opt.building} />
              </div>
              {#if opt.price}
                <span class="ml-2 shrink-0 text-xs text-gray-500">
                  {priceWithSign(opt.price)}
                </span>
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
        class="border-base bg-base-100 text-base-content w-full rounded-xl border px-4 py-3 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
        class="border-base bg-base-100 text-base-content w-full rounded-xl border px-4 py-3 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <!-- Earned Amount -->
    <div>
      <FormPrice bind:value={earnedAmount} label={t('home.earned_amount')} id="earned_amount" />

      {#if selectedBuildingId}
        {@const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId)}
        {#if selectedBuilding?.pricePerClean}
          {@const diff = earnedAmount - selectedBuilding.pricePerClean}
          {#if diff < 0}
            <div class="mt-2 text-right text-xs font-bold text-red-500">
              미수금: {priceWithSign(Math.abs(diff))}
              <span class="ml-1 font-normal text-gray-400">
                (청소 단가: {priceWithSign(selectedBuilding.pricePerClean)})
              </span>
            </div>
          {:else if diff > 0}
            <div class="mt-2 text-right text-xs font-bold text-indigo-500">
              초과 수금: {priceWithSign(diff)}
              <span class="ml-1 font-normal text-gray-400">
                (청소 단가: {priceWithSign(selectedBuilding.pricePerClean)})
              </span>
            </div>
          {/if}
        {/if}
      {/if}
    </div>

    <div class="mt-6 flex gap-3">
      {#if log}
        <button
          type="button"
          onclick={handleDelete}
          class="btn-danger flex-1"
          disabled={deleteMutation.isPending}
        >
          <Trash2 size={20} class="mx-auto" />
        </button>
      {/if}
      <button
        type="submit"
        class="btn-primary flex-[2]"
        disabled={!selectedBuildingId || !date || !time}
      >
        {log ? t('common.save') : t('common.add')}
      </button>
    </div>
  </form>
</div>
