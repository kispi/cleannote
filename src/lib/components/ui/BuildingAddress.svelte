<script lang="ts">
  import { t } from '$lib/i18n'

  interface Props {
    building: {
      address?: string | null
      apiName?: string | null
      apiAddress?: string | null
      lat?: number | null
      lng?: number | null
      [key: string]: any
    }
    class?: string
  }

  let { building, class: className }: Props = $props()
</script>

<div class="building-address {className} min-w-0 truncate text-xs">
  {#if building.lat && building.lng && building.apiName && building.apiAddress}
    <span class="font-medium text-blue-600 dark:text-blue-400">
      ✓ {building.apiName}
      <span class="text-xs opacity-75">({building.apiAddress})</span>
    </span>
  {:else}
    <span class="text-gray-400 dark:text-gray-500">
      {building.address || t('building.placeholder.address')}
    </span>
  {/if}
</div>
