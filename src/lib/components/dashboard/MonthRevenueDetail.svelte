<script lang="ts">
  import { t } from '$lib/i18n'
  import { priceWithSign } from '$lib/utils/format'
  import type { CleaningLog } from '$lib/types/cleaningLog'
  import dayjs from 'dayjs'
  import BuildingAddress from '$lib/components/ui/BuildingAddress.svelte'
  import { ui } from '$lib/store/ui.svelte'
  import ModalCleaningAdd from '$lib/components/modals/ModalCleaningAdd.svelte'
  import { sortCleaningLogs } from '$lib/utils/sort'

  interface Props {
    year: number
    month: number
    logs: CleaningLog[]
    buildings: any[] // Needed for Edit Modal pass-through essentially
  }

  let { year, month, logs, buildings }: Props = $props()

  // Filter logs for this month here or parent?
  // Let's assume parent passes *all* logs and we filter, or parent passes filtered.
  // Plan said "Props: logs (filtered)", but let's be safe.
  // Actually reusing the same list logic might be good but let's stick to simple list.

  // Sort logs by date desc
  let monthlyLogs = $derived(
    logs
      .filter((l) => {
        const d = dayjs(l.cleanStart)
        return d.year() === year && d.month() === month - 1 && l.status === 'completed'
      })
      .sort((a, b) => dayjs(b.cleanStart).valueOf() - dayjs(a.cleanStart).valueOf())
  )

  // Group logs by date
  let groupedLogs = $derived.by(() => {
    const grouped = monthlyLogs.reduce((acc: Record<string, CleaningLog[]>, log: CleaningLog) => {
      const date = dayjs(log.cleanStart).format('YYYY-MM-DD')
      if (!acc[date]) acc[date] = []
      acc[date].push(log)
      return acc
    }, {})

    // Sort logs within each group
    Object.keys(grouped).forEach((date) => {
      grouped[date] = sortCleaningLogs(grouped[date])
    })

    return grouped
  })

  let totalAmount = $derived(monthlyLogs.reduce((sum, l) => sum + (l.earnedAmount || 0), 0))

  const handleEdit = (log: CleaningLog) => {
    ui.modal.show({
      component: ModalCleaningAdd,
      props: {
        buildings,
        log
      }
    })
  }
</script>

<div class="card bg-base-100 p-6">
  <div class="mb-4 flex items-center justify-between">
    <h3 class="text-lg font-bold">
      {dayjs()
        .month(month - 1)
        .format('MMMM')}
      {t('home.history')}
    </h3>
    <span class="text-sm font-bold text-blue-600">
      {t('common.total')}: {priceWithSign(totalAmount)}
    </span>
  </div>

  {#if monthlyLogs.length === 0}
    <div class="py-10 text-center text-gray-400">{t('home.no_records')}</div>
  {:else}
    <div class="space-y-6">
      {#each Object.entries(groupedLogs).sort( (a, b) => b[0].localeCompare(a[0]) ) as [date, daysLogs]}
        <section>
          <div class="mb-3 flex items-center justify-between px-1">
            <h4 class="text-sub-content text-xs font-bold">
              {dayjs(date).format('MM.DD dddd')}
            </h4>
            <span class="text-xs font-bold text-gray-400 dark:text-gray-500">
              {priceWithSign(daysLogs.reduce((sum, log) => sum + (log.earnedAmount || 0), 0))}
            </span>
          </div>
          <div class="space-y-3">
            {#each daysLogs as log}
              {@const snapshot = log.buildingSnapshot}
              {@const price = snapshot
                ? snapshot.pricePerClean || 0
                : log.building?.pricePerClean || 0}
              {@const diff = (log.earnedAmount || 0) - price}
              {@const isUnpaid = diff < 0}
              {@const isOverpaid = diff > 0 && price > 0}

              <button
                onclick={() => handleEdit(log)}
                class="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div class="mr-4 flex min-w-0 flex-1 flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <span class="text-base-content font-bold">
                      {snapshot?.name || log.building?.name || 'Unknown Building'}
                    </span>
                  </div>
                  <BuildingAddress
                    building={snapshot || log.building || {}}
                    class="text-gray-400"
                  />
                </div>

                <div class="flex flex-col items-end">
                  {#if isUnpaid}
                    <span class="font-bold text-red-500">
                      {priceWithSign(log.earnedAmount)}
                    </span>
                    <span
                      class="rounded bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-500 dark:bg-red-900/30"
                    >
                      {t('filter.unpaid')}
                      {priceWithSign(Math.abs(diff))}
                    </span>
                  {:else if isOverpaid}
                    <span class="font-bold text-green-500">
                      {priceWithSign(log.earnedAmount)}
                    </span>
                    <span
                      class="rounded bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-500 dark:bg-green-900/30"
                    >
                      {t('filter.overpaid')}
                      {priceWithSign(diff)}
                    </span>
                  {:else}
                    <span
                      class="text-sm font-bold whitespace-nowrap text-blue-600 dark:text-blue-400"
                    >
                      {priceWithSign(log.earnedAmount ?? 0)}
                    </span>
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        </section>
      {/each}
    </div>
  {/if}
</div>
