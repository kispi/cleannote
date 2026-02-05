<script lang="ts">
  interface Props {
    class?: string
    width?: string
    height?: string
  }

  let { class: className = '', width = '100%', height = '100%' }: Props = $props()
</script>

<div
  class="animate-pulse rounded bg-gray-200 dark:bg-gray-700 {className}"
  style="width: {width}; height: {height};"
></div>
