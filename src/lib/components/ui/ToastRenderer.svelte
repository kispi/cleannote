<script lang="ts">
  import { ui } from '$lib/store/ui.svelte'
  import { fly } from 'svelte/transition'
  import { Check, AlertCircle, Info, X } from 'lucide-svelte'

  const getIcon = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return Check
      case 'error':
        return AlertCircle
      default:
        return Info
    }
  }

  const getColor = (type: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-blue-500'
    }
  }
</script>

<div
  class="pointer-events-none fixed left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2
  {ui.toast.items[0]?.position === 'top-center' ? 'top-4' : 'bottom-8'}"
>
  {#each ui.toast.items as item (item.id)}
    <div
      class="bg-base-100 pointer-events-auto relative flex min-w-[300px] items-center gap-3 overflow-hidden rounded-lg p-4 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
      transition:fly={{ y: item.position === 'top-center' ? -20 : 20, duration: 300 }}
    >
      <!-- Colored Strip -->
      <div
        class="absolute top-0 bottom-0 left-0 w-1 {getColor(item.type)}"
        style="border-top-left-radius: 0.5rem; border-bottom-left-radius: 0.5rem;"
      ></div>

      <div
        class={item.type === 'success'
          ? 'text-green-500'
          : item.type === 'error'
            ? 'text-red-500'
            : 'text-blue-500'}
      >
        <svelte:component this={getIcon(item.type)} size={20} />
      </div>

      <span class="text-base-content flex-1 text-sm font-medium">{item.text}</span>

      <button
        onclick={() => (ui.toast.items = ui.toast.items.filter((i) => i.id !== item.id))}
        class="text-sub-content hover:text-base-content transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  {/each}
</div>
