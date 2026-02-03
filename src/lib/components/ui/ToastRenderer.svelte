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
  class="pointer-events-none fixed right-4 bottom-4 left-4 z-50 flex flex-col items-center gap-2 sm:right-4 sm:left-auto sm:items-end"
>
  {#each ui.toast.items as item (item.id)}
    <div
      class="pointer-events-auto flex min-w-[300px] items-center gap-3 rounded-lg px-4 py-3 font-medium text-white shadow-lg {getColor(
        item.type
      )}"
      transition:fly={{ y: 20, duration: 300 }}
    >
      <svelte:component this={getIcon(item.type)} size={20} />
      <span class="flex-1">{item.text}</span>
      <button
        onclick={() => (ui.toast.items = ui.toast.items.filter((i) => i.id !== item.id))}
        class="text-white/80 hover:text-white"
      >
        <X size={18} />
      </button>
    </div>
  {/each}
</div>
