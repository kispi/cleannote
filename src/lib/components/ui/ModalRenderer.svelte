<script lang="ts">
  import { ui } from '$lib/store/ui.svelte'
  import { fade, scale } from 'svelte/transition'
</script>

{#if ui.modal.active}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    transition:fade={{ duration: 200 }}
    onclick={() => ui.modal.close()}
    onkeydown={(e) => e.key === 'Escape' && ui.modal.close()}
    role="button"
    tabindex="0"
  >
    <!-- Modal Content -->
    <div
      class="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl"
      transition:scale={{ duration: 200, start: 0.95 }}
      onclick={(e) => e.stopPropagation()}
      role="document"
    >
      <svelte:component this={ui.modal.active.component} {...ui.modal.active.props} />
    </div>
  </div>
{/if}
