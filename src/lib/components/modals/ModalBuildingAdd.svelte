<script lang="ts">
  import { X, Trash2 } from 'lucide-svelte'
  import { ui } from '$lib/store/ui.svelte'
  import { t } from '$lib/i18n'
  import { useUpsertBuilding, useDeleteBuilding } from '$lib/hooks/useBuildings'
  import FormPrice from '$lib/components/ui/FormPrice.svelte'
  import ModalConfirm from './ModalConfirm.svelte'
  import { createDebounce } from '$lib/utils/debounce'
  import BuildingAddress from '$lib/components/ui/BuildingAddress.svelte'
  import ModalBuildingAdded from './ModalBuildingAdded.svelte'
  import type { BuildingUpsert } from '$lib/types/building'
  import { Search } from 'lucide-svelte'
  import InputWrapper from '$lib/components/ui/InputWrapper.svelte'

  interface Props {
    building?: BuildingUpsert
    isOnboarding?: boolean
  }

  let { building, isOnboarding = false }: Props = $props()

  const upsertMutation = useUpsertBuilding({
    suppressSuccessToast: isOnboarding,
    suppressClose: isOnboarding
  })
  const deleteMutation = useDeleteBuilding()

  let name = $state(building?.name || '')
  let address = $state(building?.address || '')
  let apiName = $state(building?.apiName || '')
  let apiAddress = $state(building?.apiAddress || '')
  let lat = $state(building?.lat || null)
  let lng = $state(building?.lng || null)
  let price = $state(building?.pricePerClean || 0)
  let days = $state(building?.scheduledDays ? building.scheduledDays.split(',').map(Number) : [])
  let memo = $state(building?.memo || '')

  let showAddressGuide = $derived(address.length > 0 && !lat)

  // Search State
  let searchResults = $state<any[]>([])
  let showDropdown = $state(false)

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      searchResults = []
      showDropdown = false
      return
    }

    try {
      const res = await fetch(`/api/places/search?query=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        searchResults = data.documents
        showDropdown = true
      }
    } catch (e) {
      console.error(e)
    }
  }

  const { debounced: debouncedSearch } = createDebounce(performSearch, 300)

  const handleAddressInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    address = target.value
    // Clear location data if user types manually (forces re-selection for accuracy)
    if (lat || lng) {
      lat = null
      lng = null
      apiName = ''
      apiAddress = ''
    }
    debouncedSearch(address)
  }

  const handleAddressClick = () => {
    // If address has value, search with it. If empty, maybe show empty state or do nothing?
    // Requirement: "Click to search" -> API call once to open dropdown
    // If address is empty, searching empty string usually returns nothing or error.
    // Let's search if there is a value, or maybe default to something?
    // Actually, usually you want to search what's in there.
    if (address) {
      performSearch(address)
    }
  }

  const selectPlace = (place: any) => {
    // Address input gets Detailed Address (ROAD ADDRESS)
    // api_name = place.place_name (e.g. "Pangyo Station")
    // api_address = place.road_address_name || place.address_name
    address = place.road_address_name || place.address_name
    apiName = place.place_name
    apiAddress = place.road_address_name || place.address_name
    lat = place.y ? parseFloat(place.y) : null
    lng = place.x ? parseFloat(place.x) : null

    showDropdown = false
    searchResults = []
  }

  // Click outside to close dropdown
  function clickOutsideAction(node: HTMLElement) {
    const handleClick = (event: MouseEvent) => {
      // If click is on the input, keep open (or let focus handle it)
      // Logic: Close if click is outside the wrapper
      if (node && !node.contains(event.target as Node)) {
        showDropdown = false
      }
    }
    document.addEventListener('click', handleClick, true)
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true)
      }
    }
  }

  // Use numeric values 0 (Sun) - 6 (Sat)

  const dayOptions = [
    { label: t('building.days_option.0'), value: 0 },
    { label: t('building.days_option.1'), value: 1 },
    { label: t('building.days_option.2'), value: 2 },
    { label: t('building.days_option.3'), value: 3 },
    { label: t('building.days_option.4'), value: 4 },
    { label: t('building.days_option.5'), value: 5 },
    { label: t('building.days_option.6'), value: 6 }
  ]

  const toggleDay = (val: number) => {
    if (days.includes(val)) {
      days = days.filter((x: number) => x !== val)
    } else {
      days = [...days, val].sort((a, b) => a - b)
    }
  }

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    if (!name) return

    upsertMutation.mutate(
      {
        id: building?.id,
        name,
        address,
        apiName,
        apiAddress,
        lat,
        lng,
        pricePerClean: price,
        scheduledDays: days.join(','),
        memo
      },
      {
        onSuccess: () => {
          if (isOnboarding) {
            ui.modal.close() // Close the current Add modal
            ui.modal.show({
              component: ModalBuildingAdded,
              props: {},
              options: { preventCloseOnClickBackdrop: true }
            })
          }
        }
      }
    )
  }

  const onDeleteClick = () => {
    if (!building?.id) return

    ui.modal.show({
      component: ModalConfirm,
      props: {
        title: t('building.confirm_delete.title'),
        message: t('building.confirm_delete.message'),
        confirmText: t('common.delete'),
        cancelText: t('common.cancel'),
        isDanger: true,
        onConfirm: async () => {
          deleteMutation.mutate(building.id!)
        }
      }
    })
  }
</script>

<div class="modal-building-add bg-base-100 relative w-full p-6">
  <div class="mb-6 flex items-center justify-between">
    <h2 class="text-base-content text-xl font-bold">
      {building ? t('building.edit') : t('building.add')}
    </h2>
    <button
      type="button"
      onclick={() => ui.modal.close()}
      class="text-sub-content hover:bg-base-200 hover:text-base-content cursor-pointer rounded-full p-2 transition-colors"
    >
      <X size={20} />
    </button>
  </div>

  <form onsubmit={handleSubmit} class="space-y-4">
    <!-- ... name/address inputs ... -->
    <div>
      <label for="name" class="text-base-content mb-2 block text-sm font-medium"
        >{t('building.name')} <span class="text-red-500">*</span></label
      >
      <InputWrapper>
        <input
          id="name"
          type="text"
          bind:value={name}
          placeholder={t('building.placeholder.name')}
          class="input-wrapper-child"
        />
      </InputWrapper>
    </div>

    <div>
      <label for="address" class="text-base-content mb-2 block text-sm font-medium">
        {#if showAddressGuide}
          <span>{t('building.address_only')}</span>
          <span class="text-info ml-2 text-xs">{t('building.select_address_guide')}</span>
        {:else}
          {t('building.address')}
        {/if}
      </label>
      <div class="relative" use:clickOutsideAction>
        <InputWrapper>
          {#snippet leftIcon()}
            <Search size={18} />
          {/snippet}
          <input
            id="address"
            type="text"
            bind:value={address}
            oninput={handleAddressInput}
            onclick={handleAddressClick}
            placeholder={t('building.placeholder.search')}
            class="input-wrapper-child"
            autocomplete="off"
          />
        </InputWrapper>
        {#if showDropdown && searchResults.length > 0}
          <div
            class="border-base bg-base-100 absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-auto rounded-xl border shadow-xl"
          >
            {#each searchResults as place}
              <button
                type="button"
                class="text-base-content hover:bg-base-200 flex w-full flex-col items-start px-4 py-3 text-left text-sm transition-colors"
                onclick={() => selectPlace(place)}
              >
                <div class="text-base-content font-bold">
                  {place.place_name}
                </div>
                <div class="text-sub-content truncate text-xs">
                  {place.road_address_name || place.address_name}
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>

      {#if apiName}
        <div class="mt-2 px-1">
          <BuildingAddress building={{ apiName, apiAddress, lat, lng }} />
        </div>
      {/if}
    </div>

    <div>
      <FormPrice bind:value={price} label={t('building.price')} id="price" placeholder="0" />
    </div>

    <div>
      <label for="days" class="text-base-content mb-2 block text-sm font-medium"
        >{t('building.days')}</label
      >
      <div class="flex flex-wrap gap-2">
        {#each dayOptions as d}
          <button
            type="button"
            onclick={() => toggleDay(d.value)}
            class="h-10 w-10 cursor-pointer rounded-full text-sm font-bold transition-colors {days.includes(
              d.value
            )
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-base-200 text-sub-content hover:bg-gray-300 dark:hover:bg-gray-600'}"
          >
            {d.label}
          </button>
        {/each}
      </div>
    </div>

    <div>
      <label for="memo" class="text-base-content mb-2 block text-sm font-medium"
        >{t('building.memo')}</label
      >
      <InputWrapper>
        <textarea
          id="memo"
          bind:value={memo}
          placeholder={t('building.placeholder.memo')}
          rows="3"
          class="input-wrapper-child resize-none"
        ></textarea>
      </InputWrapper>
    </div>

    <div class="mt-6 flex gap-3">
      {#if building}
        <button
          type="button"
          onclick={onDeleteClick}
          class="btn-danger flex-1"
          disabled={deleteMutation.isPending}
        >
          <Trash2 size={20} class="mx-auto" />
        </button>
      {/if}
      <button
        type="submit"
        class="btn-primary flex-1 rounded-xl"
        disabled={!name || upsertMutation.isPending}
      >
        {building ? t('common.edit') : t('common.add')}
      </button>
    </div>
  </form>
</div>
