<script lang="ts">
  import { t } from '$lib/i18n'
  import { ChevronLeft, ChevronRight } from 'lucide-svelte'
  import dayjs from 'dayjs'
  import { useCleaningLogsByPeriod } from '$lib/hooks/useCleaningLogs'
  import 'dayjs/locale/ko'
  dayjs.locale('ko')
  import { useAllBuildings } from '$lib/hooks/useBuildings'
  import RevenueChart from '$lib/components/dashboard/RevenueChart.svelte'
  import MonthRevenueDetail from '$lib/components/dashboard/MonthRevenueDetail.svelte'

  // State
  let year = $state(dayjs().year())
  let selectedMonth = $state<number | null>(dayjs().month() + 1) // 1-12
  let filter = $state('all')

  // Fetch Logic
  // Fetch full year: Jan 1 to Dec 31
  let start = $derived(`${year}-01-01`)
  let end = $derived(`${year}-12-31`)

  const logsQuery = useCleaningLogsByPeriod(
    () => start,
    () => end,
    () => filter
  )
  const buildingsQuery = useAllBuildings()

  let logs = $derived(logsQuery.data || [])
  let buildings = $derived(buildingsQuery.data || [])

  const prevYear = () => {
    year -= 1
    selectedMonth = 12 // Auto-select December
  }

  const nextYear = () => {
    year += 1
    selectedMonth = 1 // Auto-select January
  }
</script>

<div class="flex h-full flex-col bg-gray-50 dark:bg-gray-900">
  <!-- Header / Year Selector -->
  <header class="bg-gray-50 p-6 pb-4 dark:bg-gray-900">
    <div class="flex items-center justify-between">
      <h1 class="text-base-content text-2xl font-bold">{t('nav.stats')}</h1>

      <div
        class="flex items-center gap-4 rounded-full border border-gray-100 bg-white px-4 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <button onclick={prevYear} class="text-gray-400 transition-colors hover:text-blue-600">
          <ChevronLeft size={20} />
        </button>
        <span class="text-base-content text-lg font-bold tabular-nums">{year}</span>
        <button onclick={nextYear} class="text-gray-400 transition-colors hover:text-blue-600">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  </header>

  <!-- Filter -->
  <div class="scrollbar-hide flex items-center gap-2 overflow-x-auto px-6 pb-2">
    {#each ['all', 'unpaid', 'overpaid'] as f}
      <button
        class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors {filter === f
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}"
        onclick={() => (filter = f)}
      >
        {t(`filter.${f}`)}
      </button>
    {/each}
  </div>

  <div class="flex-1 space-y-6 overflow-y-auto px-6 pb-24">
    <!-- Chart -->
    {#if logsQuery.isLoading}
      <div class="card h-[280px] animate-pulse bg-gray-200 dark:bg-gray-800"></div>
    {:else}
      <RevenueChart {year} {logs} {selectedMonth} onMonthSelect={(m) => (selectedMonth = m)} />
    {/if}

    <!-- Detail -->
    {#if selectedMonth}
      <div class="transition-all duration-300">
        <MonthRevenueDetail {year} month={selectedMonth} {logs} {buildings} />
      </div>
    {/if}
  </div>
</div>
