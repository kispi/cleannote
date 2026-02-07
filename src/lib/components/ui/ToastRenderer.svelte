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

<!-- Top Container -->
<div
  class="toast-renderer-top pointer-events-none fixed top-12 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2"
>
  {#each ui.toast.items.filter((i) => !i.position || i.position === 'top-center') as item (item.id)}
    <div
      class="bg-base-100 pointer-events-auto relative flex min-w-[350px] items-center gap-4 overflow-hidden rounded-xl px-6 py-4 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
      transition:fly={{ y: -20, duration: 300 }}
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
        <svelte:component this={getIcon(item.type)} size={24} />
      </div>

      <span class="text-base-content flex-1 text-base font-medium">{item.text}</span>

      <button
        onclick={() => (ui.toast.items = ui.toast.items.filter((i) => i.id !== item.id))}
        class="text-sub-content hover:text-base-content transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  {/each}
</div>

<!-- Bottom Container -->
<div
  class="toast-renderer-bottom pointer-events-none fixed bottom-12 left-1/2 z-50 flex -translate-x-1/2 flex-col-reverse items-center gap-2"
>
  {#each ui.toast.items.filter((i) => i.position === 'bottom-center') as item (item.id)}
    <div
      class="bg-base-100 pointer-events-auto relative flex min-w-[350px] items-center gap-4 overflow-hidden rounded-xl px-6 py-4 shadow-lg ring-1 ring-black/5 dark:ring-white/10"
      transition:fly={{ y: 20, duration: 300 }}
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
        <svelte:component this={getIcon(item.type)} size={24} />
      </div>

      <span class="text-base-content flex-1 text-base font-medium">{item.text}</span>

      <button
        onclick={() => (ui.toast.items = ui.toast.items.filter((i) => i.id !== item.id))}
        class="text-sub-content hover:text-base-content transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  {/each}
</div>
