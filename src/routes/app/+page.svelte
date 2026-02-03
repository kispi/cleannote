<script lang="ts">
  import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query'
  import { t } from '$lib/i18n'
  import { ui } from '$lib/store/ui.svelte'
  import dayjs from 'dayjs'
  import { CheckCircle2, Circle, Trophy, Plus } from 'lucide-svelte'
  import ModalCleaningAdd from '$lib/components/modals/ModalCleaningAdd.svelte'

  let { data } = $props()

  const queryClient = useQueryClient()
  const today = dayjs().format('YYYY-MM-DD')
  const currentMonth = dayjs().format('YYYY-MM')

  const revenueQuery = createQuery(() => ({
    queryKey: ['revenue', currentMonth],
    queryFn: async () => {
      const res = await fetch(`/api/revenue?month=${currentMonth}`)
      if (!res.ok) throw new Error('Failed to fetch revenue')
      return res.json()
    }
  }))

  const questsQuery = createQuery(() => ({
    queryKey: ['quests', today],
    queryFn: async () => {
      const res = await fetch(`/api/quests?date=${today}`)
      if (!res.ok) throw new Error('Failed to fetch quests')
      return res.json()
    }
  }))

  // Computed lists
  let todayQuests = $derived(questsQuery.data?.filter((q: any) => q.is_scheduled) || [])
  let otherQuests = $derived(questsQuery.data?.filter((q: any) => !q.is_scheduled) || [])

  const toggleMutation = createMutation(() => ({
    mutationFn: async (quest: any) => {
      if (quest.status === 'completed') {
        // UNDO -> DELETE
        if (!quest.log_id) return // Should not happen
        const res = await fetch(`/api/cleaning-logs?id=${quest.log_id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error()
        return { type: 'delete', id: quest.log_id }
      } else {
        // DO -> POST
        const res = await fetch('/api/cleaning-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            building_id: quest.building.id,
            clean_start: dayjs().toISOString(),
            status: 'completed'
          })
        })
        if (!res.ok) throw new Error()
        return res.json()
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quests'] })
      queryClient.invalidateQueries({ queryKey: ['revenue'] })
      // ui.toast.show(t('common.toast.saved'), 'success') // Optional, maybe too noisy for quick toggles?
      // User asked for "Check/Uncheck". Silent update + visual change is better.
      // But toast on ERROR is needed.
    },
    onError: () => {
      ui.toast.show(t('common.toast.error'), 'error')
    }
  }))
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
      <!-- Stats (Simple for now) -->
      <div class="text-right">
        <p class="text-sub-content text-xs">{t('home.monthly_revenue')}</p>
        <p class="text-xl font-bold text-blue-600 dark:text-blue-400">
          {(revenueQuery.data?.totalAmount || 0).toLocaleString()}{t('common.unit_won')}
        </p>
      </div>
    </div>
  </header>

  <!-- Add Record Action -->
  <button
    class="btn-primary mb-8 w-full rounded-2xl shadow-lg active:scale-[0.98] dark:shadow-none"
    onclick={() =>
      ui.modal.show(
        ModalCleaningAdd,
        { buildings: questsQuery.data?.map((q: any) => q.building) || [] },
        { preventCloseOnClickBackdrop: true }
      )}
  >
    <Plus />
    {t('cleaning.add_record')}
  </button>

  <!-- Section: Today's Quests -->
  <section>
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-base-content text-lg font-bold">{t('home.today_quests')}</h3>
      <span class="bg-base-200 text-sub-content rounded-full px-3 py-1 text-xs font-bold">
        {questsQuery.data?.filter((q: any) => q.status === 'completed').length || 0} / {questsQuery
          .data?.length || 0}
      </span>
    </div>

    {#if questsQuery.isLoading}
      <div class="space-y-3">
        {#each Array(3) as _}
          <div class="bg-base-200 h-20 w-full animate-pulse rounded-xl"></div>
        {/each}
      </div>
    {:else if questsQuery.data?.length === 0}
      <div
        class="bg-base-200 flex flex-col items-center justify-center rounded-2xl border border-gray-100 py-12 text-center dark:border-gray-800"
      >
        <div
          class="mb-3 rounded-full bg-blue-100 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
        >
          <CheckCircle2 size={32} />
        </div>
        <p class="text-base-content font-bold">{t('home.no_quests_title')}</p>
        <p class="text-sub-content text-sm">{t('home.no_quests_message')}</p>
      </div>
    {:else}
      <div class="space-y-3">
        {#each todayQuests as quest (quest.building.id)}
          {@render questItem(quest)}
        {/each}
      </div>
    {/if}
  </section>

  <!-- Section: Other Buildings -->
  {#if otherQuests.length > 0}
    <section class="mt-8">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-base-content text-lg font-bold">
          {t('home.other_quests') || '그 외 건물'}
        </h3>
      </div>
      <div class="space-y-3">
        {#each otherQuests as quest (quest.building.id)}
          {@render questItem(quest)}
        {/each}
      </div>
    </section>
  {/if}
</div>

{#snippet questItem(quest: any)}
  <button
    class="group flex w-full items-center justify-between rounded-2xl border p-5 shadow-sm transition-all active:scale-[0.98]
    {quest.status === 'completed'
      ? 'border-blue-100 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/10'
      : 'border-gray-100 bg-white hover:border-blue-200 dark:border-gray-800 dark:bg-gray-900'}"
    onclick={() => toggleMutation.mutate(quest)}
    disabled={toggleMutation.isPending}
  >
    <div class="text-left">
      <h4
        class="text-lg font-bold text-gray-900 dark:text-white {quest.status === 'completed'
          ? 'line-through opacity-50'
          : ''}"
      >
        {quest.building.name}
      </h4>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {quest.building.address || ''}
        {#if quest.building.price_per_clean}
          • {quest.building.price_per_clean.toLocaleString()}{t('common.unit_won')}
        {/if}
      </p>
    </div>

    <div
      class="flex-shrink-0 transition-transform duration-200 {quest.status === 'completed'
        ? 'scale-110'
        : 'group-hover:scale-110'}"
    >
      {#if quest.status === 'completed'}
        <CheckCircle2 class="h-8 w-8 fill-blue-100 text-blue-500 dark:fill-blue-900" />
      {:else}
        <Circle class="h-8 w-8 text-gray-300 dark:text-gray-600" />
      {/if}
    </div>
  </button>
{/snippet}
