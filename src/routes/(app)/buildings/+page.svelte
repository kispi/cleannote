<script lang="ts">
  import { Plus, Navigation, Trash2 } from 'lucide-svelte'
  import { ui } from '$lib/store/ui.svelte'
  import { t } from '$lib/i18n'
  import ModalBuildingAdd from '$lib/components/modals/ModalBuildingAdd.svelte'
  import ModalNavigation from '$lib/components/modals/ModalNavigation.svelte'
  import ModalConfirm from '$lib/components/modals/ModalConfirm.svelte'
  import { priceWithSign } from '$lib/utils/format'
  import { useBuildings, useDeleteBuilding } from '$lib/hooks/useBuildings'
  import { fade } from 'svelte/transition'
  import InfiniteScroll from '$lib/components/ui/InfiniteScroll.svelte'
  import BuildingAddress from '$lib/components/ui/BuildingAddress.svelte'
  import Skeleton from '$lib/components/ui/Skeleton.svelte'

  const query = useBuildings()
  const deleteMutation = useDeleteBuilding()

  // @ts-ignore
  let allBuildings = $derived(query.data?.pages.flatMap((page: any) => page.data) || [])
  // @ts-ignore
  let totalCount = $derived(query.data?.pages[0]?.total || 0)

  const handleDelete = (building: any) => {
    ui.modal.show({
      component: ModalConfirm,
      props: {
        title: t('building.delete_confirm.title'),
        message: t('building.delete_confirm.message'),
        isDanger: true,
        confirmText: t('common.delete'),
        onConfirm: async () => {
          deleteMutation.mutate(building.id)
        }
      }
    })
  }
</script>

<div class="page-app-buildings flex h-full flex-col bg-gray-50 dark:bg-gray-900">
  <!-- Sticky Header -->
  <header class="bg-gray-50 p-6 pb-4 dark:bg-gray-900">
    <div class="mb-6">
      <h1 class="text-base-content text-2xl font-bold">
        {t('building.manage')}
      </h1>
    </div>

    <button
      class="btn-primary w-full rounded-xl shadow-lg active:scale-[0.98] dark:shadow-none"
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
  </header>

  <!-- Scrollable Content -->
  <div class="flex-1 overflow-y-auto px-6 pb-24">
    <div class="space-y-4">
      {#each allBuildings as building (building.id)}
        <div
          role="button"
          tabindex="0"
          onclick={() =>
            ui.modal.show({
              component: ModalBuildingAdd,
              props: { building },
              options: { preventCloseOnClickBackdrop: true }
            })}
          onkeydown={(e) => {
            if (e.key === 'Enter') {
              ui.modal.show({
                component: ModalBuildingAdd,
                props: { building },
                options: { preventCloseOnClickBackdrop: true }
              })
            }
          }}
          class="card w-full cursor-pointer text-left transition-transform active:scale-[0.98]"
          transition:fade={{ duration: 150 }}
        >
          <div class="flex items-start justify-between">
            <div class="mr-3 flex min-w-0 flex-1 flex-col">
              <h3 class="text-base-content text-lg font-bold">{building.name}</h3>

              {#if building.scheduledDays}
                <div class="my-1 flex flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-400">
                  {#each building.scheduledDays.split(',') as day}
                    <span class="rounded bg-gray-100 px-2 py-1 dark:bg-gray-700 dark:text-gray-300"
                      >{t(`building.days_option.${day}`)}</span
                    >
                  {/each}
                </div>
              {/if}

              <div class="mt-0.5 w-full">
                <BuildingAddress {building} />
              </div>

              <div class="mt-1 font-bold text-blue-600 dark:text-blue-400">
                {priceWithSign(building.pricePerClean || 0)}
              </div>
            </div>

            <div class="-mt-2 -mr-2 flex items-center gap-1">
              {#if building.lat && building.lng}
                <button
                  class="rounded-full p-2 text-blue-500 transition-colors hover:bg-blue-50 active:scale-90 dark:hover:bg-blue-900/20"
                  onclick={(e) => {
                    e.stopPropagation()
                    ui.modal.show({
                      component: ModalNavigation,
                      props: {
                        lat: building.lat,
                        lng: building.lng,
                        name: building.name,
                        apiName: building.apiName,
                        placeId: building.placeId
                      }
                    })
                  }}
                >
                  <Navigation size={20} />
                </button>
              {/if}

              <button
                class="text-sub-content hover:bg-base-200 rounded-full p-2 transition-colors hover:text-red-500 active:scale-90 dark:hover:bg-red-900/20"
                onclick={(e) => {
                  e.stopPropagation()
                  handleDelete(building)
                }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      {:else}
        {#if query.isLoading}
          {#each Array(5) as _}
            <div class="card w-full p-4 mb-4">
              <div class="flex items-start gap-4">
                <div class="flex-1 space-y-2">
                  <Skeleton height="24px" width="60%" />
                  <Skeleton height="16px" width="40%" />
                  <Skeleton height="16px" width="30%" />
                </div>
              </div>
            </div>
          {/each}
        {:else if !query.isFetching}
          <div class="text-center py-12 text-gray-400">
            {t('building.empty')}
          </div>
        {/if}
      {/each}

      <InfiniteScroll
        hasMore={query.hasNextPage}
        isLoading={query.isFetchingNextPage}
        fetchMore={() => query.fetchNextPage()}
      />
    </div>
  </div>
</div>
