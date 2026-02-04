<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  interface Props {
    hasMore: boolean
    isLoading?: boolean
    fetchMore: () => void
    threshold?: number
  }

  let { hasMore, isLoading = false, fetchMore, threshold = 0 }: Props = $props()

  let element: HTMLDivElement
  let observer: IntersectionObserver

  onMount(() => {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchMore()
        }
      },
      {
        root: null,
        rootMargin: `${threshold}px`,
        threshold: 0.1
      }
    )

    if (element) {
      observer.observe(element)
    }
  })

  onDestroy(() => {
    if (observer) {
      observer.disconnect()
    }
  })
</script>

<div bind:this={element} class="infinite-scroll h-4 w-full">
  {#if isLoading}
    <div class="flex justify-center py-2">
      <div
        class="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
      ></div>
    </div>
  {/if}
</div>
