<script lang="ts">
  import { Plus } from 'lucide-svelte'
  import { ui } from '$lib/store/ui.svelte'
  import { t } from '$lib/i18n'
  import ModalBuildingAdd from '$lib/components/modals/ModalBuildingAdd.svelte'

  let { data } = $props()
</script>

<div class="relative min-h-[calc(100vh-80px)] p-6">
  <header class="mb-6">
    <h1 class="text-base-content text-2xl font-bold">{t('building.manage')}</h1>
    <p class="text-sub-content text-sm">{t('building.total', { count: data.buildings.length })}</p>
  </header>

  <div class="space-y-4 pb-24">
    {#each data.buildings as building (building.id)}
      <button
        onclick={() =>
          ui.modal.show({
            component: ModalBuildingAdd,
            props: { building },
            options: { preventCloseOnClickBackdrop: true }
          })}
        class="border-base bg-base-100 hover:bg-base-200 w-full rounded-xl border p-4 text-left shadow-sm transition-transform active:scale-[0.98] dark:shadow-none"
      >
        <div class="mb-2 flex items-start justify-between">
          <h3 class="text-base-content text-lg font-bold">{building.name}</h3>
          <span class="text-sm font-bold text-blue-600 dark:text-blue-400">
            {building.price_per_clean ? building.price_per_clean.toLocaleString() : 0}{t(
              'common.unit_won'
            )}
          </span>
        </div>
        {#if building.scheduled_days}
          <div class="mb-3 flex flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-400">
            {#each building.scheduled_days.split(',') as day}
              <span class="bg-base-200 rounded px-2 py-1">{t(`building.days_option.${day}`)}</span>
            {/each}
          </div>
        {/if}
        <p class="truncate text-xs text-gray-400 dark:text-gray-500">
          {building.address || t('building.placeholder.address')}
        </p>
      </button>
    {:else}
      <div class="text-center py-12 text-gray-400">
        {t('building.total', { count: 0 })}
      </div>
    {/each}
  </div>

  <!-- Floating Action Button -->
  <button
    onclick={() =>
      ui.modal.show({
        component: ModalBuildingAdd,
        props: {},
        options: { preventCloseOnClickBackdrop: true }
      })}
    class="fixed right-6 bottom-24 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-300 transition-transform active:scale-95"
  >
    <Plus />
  </button>
</div>
