<script lang="ts">
  import { useQueryClient } from '@tanstack/svelte-query'
  import { t } from '$lib/i18n'
  import { ui } from '$lib/store/ui.svelte'
  import dayjs from 'dayjs'
  import 'dayjs/locale/ko'
  import { Trash2, Plus, CalendarClock } from 'lucide-svelte'
  import ModalCleaningAdd from '$lib/components/modals/ModalCleaningAdd.svelte'
  import ModalConfirm from '$lib/components/modals/ModalConfirm.svelte'
  import { useRevenue } from '$lib/hooks/useRevenue'
  import { useBuildings } from '$lib/hooks/useBuildings'
  import { useCleaningLogs, useDeleteCleaningLog } from '$lib/hooks/useCleaningLogs'
  import { priceWithSign } from '$lib/utils/format'

  dayjs.locale('ko')

  let { data } = $props()

  const queryClient = useQueryClient()
  const currentMonth = dayjs().format('YYYY-MM')

  const revenueQuery = useRevenue(currentMonth)
  const buildingsQuery = useBuildings()
  const logsQuery = useCleaningLogs(20)
  const deleteMutation = useDeleteCleaningLog()

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
</script>

<div class="p-6 pb-24">
  <!-- Header -->
  <header class="mb-6">
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
      <div class="text-right">
        <p class="text-sub-content text-xs">{t('home.monthly_revenue')}</p>
        <p class="text-xl font-bold text-blue-600 dark:text-blue-400">
          {priceWithSign(revenueQuery.data?.totalAmount || 0)}
        </p>
      </div>
    </div>
  </header>

  <!-- Add Record Action -->
  <button
    class="btn-primary mb-8 w-full rounded-2xl shadow-lg active:scale-[0.98] dark:shadow-none"
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

  <!-- Section: Recent Logs -->
  <section>
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-base-content text-lg font-bold">{t('home.recent_logs')}</h3>
    </div>

    {#if logsQuery.isLoading}
      <div class="space-y-3">
        {#each Array(3) as _}
          <div class="bg-base-200 h-20 w-full animate-pulse rounded-xl"></div>
        {/each}
      </div>
    {:else if logsQuery.data?.length === 0}
      <div
        class="bg-base-200 flex flex-col items-center justify-center rounded-2xl border border-gray-100 py-12 text-center dark:border-gray-800"
      >
        <div
          class="mb-3 rounded-full bg-blue-100 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
        >
          <CalendarClock size={32} />
        </div>
        <p class="text-base-content font-bold">{t('home.no_logs_title')}</p>
        <p class="text-sub-content text-sm">{t('home.no_logs_message')}</p>
      </div>
    {:else}
      <div class="space-y-3">
        {#each logsQuery.data as log (log.id)}
          <div
            class="group bg-base-100 flex w-full items-center justify-between rounded-2xl border p-5 shadow-sm transition-all dark:border-gray-700 dark:bg-gray-800/50"
          >
            <div class="text-left">
              <h4 class="text-base-content text-lg font-bold">
                {log.building.name}
              </h4>
              <p class="text-sub-content mt-0.5 text-sm">
                {dayjs(log.clean_start).format('MM.DD (dd)')} • {log.building.address || ''}
              </p>
              {#if log.earned_amount > 0}
                <p class="mt-1 font-bold text-blue-600 dark:text-blue-400">
                  {priceWithSign(log.earned_amount)}
                </p>
              {/if}
            </div>

            <button
              class="text-sub-content rounded-full p-3 transition-colors hover:bg-red-50 hover:text-red-500 active:scale-90 dark:hover:bg-red-900/20"
              onclick={() => handleDelete(log)}
              disabled={deleteMutation.isPending}
              aria-label="Delete log"
            >
              <Trash2 size={20} />
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>
