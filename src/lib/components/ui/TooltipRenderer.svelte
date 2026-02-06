<script lang="ts">
  import { tooltip } from '$lib/store/tooltip.svelte'

  // Offset from cursor
  const OFFSET_X = 12
  const OFFSET_Y = 12
</script>

{#if tooltip.visible}
  <div
    class="pointer-events-none fixed z-[9999] rounded bg-gray-900 px-2 py-1 text-xs font-bold text-white shadow-md
           transition-opacity duration-75 dark:bg-white dark:text-gray-900"
    style="top: {tooltip.y + OFFSET_Y}px; left: {tooltip.x + OFFSET_X}px;"
  >
    {tooltip.content}
  </div>
{/if}
