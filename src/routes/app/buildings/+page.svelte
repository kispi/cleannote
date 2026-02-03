<script lang="ts">
  import { Plus } from 'lucide-svelte'
  import { ui } from '$lib/store/ui.svelte'
  import { t } from '$lib/i18n'
  import ModalBuildingAdd from '$lib/components/modals/ModalBuildingAdd.svelte'
  import { priceWithSign } from '$lib/utils/format'

  let { data } = $props()
</script>

<div class="relative min-h-[calc(100vh-80px)] p-6">
  <header class="mb-6">
    <h1 class="text-base-content text-2xl font-bold">{t('building.manage')}</h1>
    <p class="text-sub-content mt-1">
      {t('building.total', { count: data.buildings.length })}
    </p>
  </header>

  <button
    class="btn-primary mb-8 w-full rounded-xl shadow-lg active:scale-[0.98] dark:shadow-none"
    onclick={() =>
      ui.modal.show({
        component: ModalBuildingAdd,
        props: {},
        options: { preventCloseOnClickBackdrop: true }
      })}
  >
    <Plus />
    {t('building.add')}
  </button>

  <div class="space-y-4 pb-24">
    {#each data.buildings as building (building.id)}
      <button
        onclick={() =>
          ui.modal.show({
            component: ModalBuildingAdd,
            props: { building },
            options: { preventCloseOnClickBackdrop: true }
          })}
        class="card w-full text-left transition-transform active:scale-[0.98]"
      >
        <div class="mb-2 flex items-start justify-between">
          <h3 class="text-base-content text-lg font-bold">{building.name}</h3>
          <span class="text-sm font-bold text-blue-600 dark:text-blue-400">
            {building.pricePerClean ? priceWithSign(building.pricePerClean) : 0}
          </span>
        </div>
        {#if building.scheduledDays}
          <div class="mb-3 flex flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-400">
            {#each building.scheduledDays.split(',') as day}
              <span class="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700 dark:text-gray-300"
                >{t(`building.days_option.${day}`)}</span
              >
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
</div>
