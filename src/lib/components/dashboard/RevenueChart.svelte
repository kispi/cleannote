<script lang="ts">
  import { t } from '$lib/i18n'
  import { priceWithSign } from '$lib/utils/format'
  import type { CleaningLog } from '$lib/types/cleaningLog'
  import dayjs from 'dayjs'
  import { uiTooltip } from '$lib/actions/tooltip'

  interface Props {
    year: number
    logs: CleaningLog[]
    selectedMonth: number | null
    onMonthSelect: (month: number) => void
  }

  let { year, logs, selectedMonth, onMonthSelect }: Props = $props()

  // Process data for charts
  let chartData = $derived.by(() => {
    // Array 0-11 for Jan-Dec
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      amount: 0,
      count: 0
    }))

    logs.forEach((log) => {
      const d = dayjs(log.cleanStart)
      if (d.year() === year && log.status === 'completed') {
        const m = d.month() // 0-11
        monthlyData[m].amount += log.earnedAmount || 0
        monthlyData[m].count += 1
      }
    })

    const maxAmount = Math.max(...monthlyData.map((d) => d.amount), 1) // Prevent div by 0

    return monthlyData.map((d) => ({
      ...d,
      heightUser: d.amount === 0 ? 0 : Math.max((d.amount / maxAmount) * 100, 2) // Min 2% for visibility
    }))
  })

  const getMonthName = (m: number) => {
    return dayjs()
      .month(m - 1)
      .format('MMM')
  }
</script>

<div class="card bg-base-100 p-6">
  <div class="mb-6 flex items-center justify-between">
    <h3 class="text-lg font-bold">
      {t('home.monthly_revenue')}
    </h3>
    <div class="text-xs text-gray-400">
      {year}
    </div>
  </div>

  <!-- Chart Area -->
  <div class="flex h-[200px] items-end justify-between gap-1 sm:gap-2">
    {#each chartData as d}
      {@const isActive = selectedMonth === d.month}
      <button
        onclick={() => onMonthSelect(d.month)}
        use:uiTooltip={priceWithSign(d.amount)}
        class="group relative flex h-full flex-1 flex-col items-center justify-end"
      >
        <!-- Bar -->
        <div
          class="w-full max-w-[20px] rounded-t-lg transition-all duration-300 {isActive
            ? 'bg-blue-600 dark:bg-blue-500'
            : 'bg-blue-100 hover:bg-blue-200 dark:bg-gray-700 dark:hover:bg-gray-600'}"
          style="height: {d.heightUser}%;"
        ></div>

        <!-- Label -->
        <div
          class="mt-2 text-[10px] font-medium {isActive
            ? 'font-bold text-blue-600'
            : 'text-gray-400'}"
        >
          {getMonthName(d.month)}
        </div>
      </button>
    {/each}
  </div>
</div>
