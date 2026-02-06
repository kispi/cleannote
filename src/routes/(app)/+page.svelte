<script lang="ts">
  import { useQueryClient } from '@tanstack/svelte-query'
  import { t } from '$lib/i18n'
  import { ui } from '$lib/store/ui.svelte'
  import dayjs from 'dayjs'
  import 'dayjs/locale/ko'
  import { Trash2, Plus, CalendarClock } from 'lucide-svelte'
  import ModalCleaningAdd from '$lib/components/modals/ModalCleaningAdd.svelte'
  import ModalBuildingAdd from '$lib/components/modals/ModalBuildingAdd.svelte'
  import ModalConfirm from '$lib/components/modals/ModalConfirm.svelte'
  import { useRevenue } from '$lib/hooks/useRevenue'
  import { useAllBuildings } from '$lib/hooks/useBuildings'
  import { useCleaningLogs, useDeleteCleaningLog } from '$lib/hooks/useCleaningLogs'
  import { priceWithSign } from '$lib/utils/format'
  import BuildingAddress from '$lib/components/ui/BuildingAddress.svelte'
  import InfiniteScroll from '$lib/components/ui/InfiniteScroll.svelte'

  dayjs.locale('ko')

  let { data } = $props()

  const queryClient = useQueryClient()
  const currentMonth = dayjs().format('YYYY-MM')

  let filter = $state('all')

  const revenueQuery = useRevenue(currentMonth)
  const buildingsQuery = useAllBuildings()
  const logsQuery = useCleaningLogs(() => filter)
  const deleteMutation = useDeleteCleaningLog()

  // Flatten pages into a single array
  let allLogs = $derived((logsQuery.data?.pages.flatMap((page: any) => page.data) || []) as any[])

  const handleDelete = (log: any) => {
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

  // Group logs by date
  let groupedLogs = $derived(
    allLogs.reduce(
      (acc: Record<string, any[]>, log: any) => {
        const date = dayjs(log.cleanStart).format('YYYY-MM-DD')
        if (!acc[date]) acc[date] = []
        acc[date].push(log)
        return acc
      },
      {} as Record<string, any[]>
    )
  )
</script>

<div class="page-app-home flex h-full flex-col bg-gray-50 dark:bg-gray-900">
  <!-- Sticky Header -->
  <header class="bg-gray-50 p-6 pb-4 dark:bg-gray-900">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-base-content text-2xl font-bold">
          {t('home.greeting', { name: data.user.name })}
        </h1>
        <p class="text-sub-content mt-1">
          {dayjs().format('YYYY.MM.DD dddd')}
        </p>
      </div>
      <!-- Stats -->
      <a
        href="/dashboard"
        class="group text-right transition-opacity hover:opacity-80 active:scale-95"
      >
        <p class="text-sub-content text-xs transition-colors group-hover:text-blue-500">
          {t('home.monthly_revenue')}
        </p>
        <p class="text-xl font-bold text-blue-600 dark:text-blue-400">
          {priceWithSign(revenueQuery.data?.totalAmount || 0)}
        </p>
      </a>
    </div>

    <!-- Add Record Action -->
    <!-- Add Record Action -->
    {#if buildingsQuery.isSuccess && buildingsQuery.data.length === 0}
      <button
        class="btn-primary mt-6 w-full rounded-xl shadow-lg active:scale-[0.98] dark:shadow-none"
        onclick={() =>
          ui.modal.show({
            component: ModalBuildingAdd,
            props: { isOnboarding: true },
            options: { preventCloseOnClickBackdrop: true }
          })}
      >
        <Plus />
        {t('home.add_first_building')}
      </button>
    {:else}
      <button
        class="btn-primary mt-6 w-full rounded-xl shadow-lg active:scale-[0.98] dark:shadow-none"
        onclick={() =>
          ui.modal.show({
            component: ModalCleaningAdd,
            props: { buildings: buildingsQuery.data || [] },
            options: { preventCloseOnClickBackdrop: true }
          })}
      >
        <Plus />
        {t('cleaning.add_record')}
      </button>
    {/if}
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

  <!-- Scrollable Content -->
  <div class="flex-1 overflow-y-auto px-6 pb-24">
    <!-- Section: Recent Logs -->
    <section>
      {#if logsQuery.isLoading}
        <div class="space-y-3">
          {#each Array(3) as _}
            <div class="bg-base-200 h-20 w-full animate-pulse rounded-xl"></div>
          {/each}
        </div>
      {:else if allLogs.length === 0}
        <div
          class="bg-base-200 flex flex-col items-center justify-center rounded-xl border border-gray-100 py-12 text-center dark:border-gray-800"
        >
          <div
            class="mb-3 rounded-full bg-blue-100 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
          >
            <CalendarClock size={32} />
          </div>
          <p class="text-base-content font-bold">
            {buildingsQuery.data?.length === 0
              ? t('home.no_buildings_title')
              : t('home.no_logs_title')}
          </p>
          <p class="text-sub-content text-sm">
            {buildingsQuery.data?.length === 0
              ? t('home.no_buildings_message')
              : t('home.no_logs_message')}
          </p>
        </div>
      {:else}
        <div class="space-y-6">
          {#each Object.entries(groupedLogs).sort( (a, b) => b[0].localeCompare(a[0]) ) as [date, logs]}
            <section>
              <h4 class="text-sub-content mb-3 px-1 text-xs font-bold">
                {#if date === dayjs().format('YYYY-MM-DD')}
                  {t('common.today')}
                {:else if date === dayjs().subtract(1, 'day').format('YYYY-MM-DD')}
                  {t('common.yesterday')}
                {:else}
                  {dayjs(date).format('MM.DD dddd')}
                {/if}
              </h4>
              <div class="space-y-3">
                {#each logs as log (log.id)}
                  {@const snapshot = log.buildingSnapshot}
                  {@const price = snapshot
                    ? snapshot.pricePerClean || 0
                    : log.building.pricePerClean || 0}
                  {@const diff = log.earnedAmount - price}
                  {@const isUnpaid = diff < 0}
                  {@const isOverpaid = diff > 0 && price > 0}

                  <div
                    role="button"
                    tabindex="0"
                    class="card group flex w-full cursor-pointer items-start justify-between text-left transition-all active:scale-[0.99]"
                    onclick={() =>
                      ui.modal.show({
                        component: ModalCleaningAdd,
                        props: {
                          buildings: buildingsQuery.data || [],
                          log
                        },
                        options: { preventCloseOnClickBackdrop: true }
                      })}
                    onkeydown={(e) => {
                      if (e.key === 'Enter') {
                        ui.modal.show({
                          component: ModalCleaningAdd,
                          props: {
                            buildings: buildingsQuery.data || [],
                            log
                          },
                          options: { preventCloseOnClickBackdrop: true }
                        })
                      }
                    }}
                  >
                    <div class="mr-3 flex min-w-0 flex-1 flex-col">
                      <div class="flex items-center justify-between gap-2">
                        <h4 class="text-base-content truncate text-lg font-bold">
                          {snapshot ? snapshot.name : log.building.name}
                        </h4>
                      </div>
                      <div class="mt-0.5 w-full">
                        {#if snapshot}
                          <BuildingAddress
                            building={{
                              apiName: snapshot.apiName,
                              apiAddress: snapshot.apiAddress,
                              address: snapshot.address,
                              lat: snapshot.lat,
                              lng: snapshot.lng
                            }}
                          />
                        {:else}
                          <BuildingAddress building={log.building} />
                        {/if}
                      </div>

                      {#if isUnpaid}
                        <div class="mt-1 flex flex-col items-start">
                          <span class="font-bold text-red-500">
                            {priceWithSign(log.earnedAmount)}
                          </span>
                          <span
                            class="rounded bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-500 dark:bg-red-900/30"
                          >
                            미수 {priceWithSign(Math.abs(diff))}
                          </span>
                        </div>
                      {:else if isOverpaid}
                        <div class="mt-1 flex flex-col items-start">
                          <span class="font-bold text-green-500">
                            {priceWithSign(log.earnedAmount)}
                          </span>
                          <span
                            class="rounded bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-500 dark:bg-green-900/30"
                          >
                            초과 {priceWithSign(diff)}
                          </span>
                        </div>
                      {:else if log.earnedAmount > 0}
                        <p class="mt-1 font-bold text-blue-600 dark:text-blue-400">
                          {priceWithSign(log.earnedAmount)}
                        </p>
                      {/if}
                    </div>

                    <div
                      role="button"
                      tabindex="0"
                      class="text-sub-content hover:bg-base-200 -mt-2 -mr-2 rounded-full p-2 transition-colors hover:text-red-500 active:scale-90 dark:hover:bg-red-900/20"
                      onclick={(e) => {
                        e.stopPropagation()
                        handleDelete(log)
                      }}
                      onkeydown={(e) => {
                        if (e.key === 'Enter') {
                          e.stopPropagation()
                          handleDelete(log)
                        }
                      }}
                    >
                      <Trash2 size={20} />
                    </div>
                  </div>
                {/each}
              </div>
            </section>
          {/each}

          <InfiniteScroll
            hasMore={logsQuery.hasNextPage}
            isLoading={logsQuery.isFetchingNextPage}
            fetchMore={() => logsQuery.fetchNextPage()}
          />
        </div>
      {/if}
    </section>
  </div>
</div>
