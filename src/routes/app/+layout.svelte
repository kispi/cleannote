<script lang="ts">
  import { redirect } from '@sveltejs/kit'
  import type { LayoutData } from './$types'

  interface Props {
    data: LayoutData
    children?: import('svelte').Snippet
  }

  let { data, children }: Props = $props()
</script>

<!-- Logged-in specific layout (e.g. Navigation Bar) could go here -->
<div class="flex min-h-screen flex-col">
  <div class="flex-1">
    {@render children?.()}
  </div>

  <!-- Bottom Navigation Placeholder -->
  <nav
    class="sticky bottom-0 flex items-center justify-between border-t border-gray-100 bg-white px-6 py-3 text-xs text-gray-400"
  >
    <a href="/app" class="flex flex-col items-center gap-1 font-medium text-blue-600">
      <div class="h-6 w-6 rounded-full bg-blue-100"></div>
      홈
    </a>
    <a href="/app/buildings" class="flex flex-col items-center gap-1 hover:text-gray-600">
      <div class="h-6 w-6 rounded-full bg-gray-100"></div>
      건물
    </a>
    <a href="/app/settings" class="flex flex-col items-center gap-1 hover:text-gray-600">
      <div class="h-6 w-6 rounded-full bg-gray-100"></div>
      설정
    </a>
  </nav>
</div>
