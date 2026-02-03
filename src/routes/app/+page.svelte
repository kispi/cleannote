<script lang="ts">
  import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query'
  import { t } from '$lib/i18n'
  import { ui } from '$lib/store/ui.svelte'
  import dayjs from 'dayjs'
  import { CheckCircle2, Circle, Trophy } from 'lucide-svelte'

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
            date: today,
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
  <header class="mb-8 pt-4">
    <div class="mb-1 text-lg font-medium text-gray-500 dark:text-gray-400">
      {t('home.greeting', { name: data.user?.name || 'User' })}
    </div>
    <h2 class="text-sm font-medium text-gray-500 dark:text-gray-400">{t('home.revenue')}</h2>
    <div class="mt-1 flex items-baseline gap-1">
      <span class="text-4xl font-extrabold text-gray-900 dark:text-white">
        {revenueQuery.data?.totalAmount?.toLocaleString() || 0}
      </span>
      <span class="text-xl font-bold text-gray-500 dark:text-gray-400">{t('common.unit_won')}</span>
    </div>
  </header>

  <!-- Section: Today's Quests -->
  <section class="mb-8">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">{t('home.today_quests')}</h3>
      <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
        {todayQuests.filter((q: any) => q.status === 'completed').length} / {todayQuests.length}
      </span>
    </div>

    <div class="space-y-3">
      {#if questsQuery.isLoading}
        <div class="animate-pulse py-12 text-center text-gray-400">Loading...</div>
      {:else if todayQuests.length === 0}
        <div
          class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-8 text-center text-gray-400 dark:border-gray-700"
        >
          <Trophy class="mb-2 h-8 w-8 opacity-30" />
          <p class="text-sm">{t('home.no_quests')}</p>
        </div>
      {:else}
        {#each todayQuests as quest (quest.building.id)}
          {@render questItem(quest)}
        {/each}
      {/if}
    </div>
  </section>

  <!-- Section: Other Buildings -->
  {#if otherQuests.length > 0}
    <section>
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">
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
