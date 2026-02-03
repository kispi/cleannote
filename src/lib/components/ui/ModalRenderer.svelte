<script lang="ts">
  import { ui } from '$lib/store/ui.svelte'
  import { fade, scale } from 'svelte/transition'

  const handleBackdropClick = (item: any) => {
    if (!item.options?.preventCloseOnClickBackdrop) {
      ui.modal.close()
    }
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && ui.modal.items.length > 0) {
      // Always close the top modal on Escape, ignoring preventCloseOnClickBackdrop
      ui.modal.close()
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#each ui.modal.items as item (item.id)}
  <!-- Backdrop -->
  <div
    class="modal-renderer fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm dark:bg-black/60"
    transition:fade={{ duration: 200 }}
    onclick={(e) => {
      if (e.target === e.currentTarget) handleBackdropClick(item)
    }}
    onkeydown={(e) => {
      if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        handleBackdropClick(item)
      }
    }}
    role="button"
    tabindex="0"
  >
    <!-- Modal Content -->
    <div
      class="bg-base-100 relative w-full max-w-lg overflow-hidden rounded-xl shadow-xl"
      transition:scale={{ duration: 200, start: 0.95 }}
      role="document"
      tabindex="-1"
    >
      <svelte:component this={item.component} {...item.props} />
    </div>
  </div>
{/each}
