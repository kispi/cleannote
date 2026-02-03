<script lang="ts">
  import { redirect } from '@sveltejs/kit'
  import { page } from '$app/stores'
  import { t } from '$lib/i18n'
  import { Home, Building, Settings } from 'lucide-svelte'
  import type { LayoutData } from './$types'

  interface Props {
    data: LayoutData
    children?: import('svelte').Snippet
  }

  let { data, children }: Props = $props()

  const activeClass = (path: string) =>
    $page.url.pathname === path ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
</script>

<!-- Logged-in specific layout (e.g. Navigation Bar) could go here -->
<div class="flex min-h-screen flex-col">
  <div class="flex-1">
    {@render children?.()}
  </div>

  <!-- Bottom Navigation -->
  <nav
    class="sticky bottom-0 z-50 flex w-full items-center justify-between border-t border-gray-100 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90"
  >
    <a
      href="/app"
      class="group flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 {activeClass(
        '/app'
      )}"
    >
      <Home size={24} class="transition-transform group-active:scale-95" />
      <span class="text-[10px] font-medium">{t('nav.home')}</span>
    </a>
    <a
      href="/app/buildings"
      class="group flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 {activeClass(
        '/app/buildings'
      )}"
    >
      <Building size={24} class="transition-transform group-active:scale-95" />
      <span class="text-[10px] font-medium">{t('nav.buildings')}</span>
    </a>
    <a
      href="/app/settings"
      class="group flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 {activeClass(
        '/app/settings'
      )}"
    >
      <Settings size={24} class="transition-transform group-active:scale-95" />
      <span class="text-[10px] font-medium">{t('nav.settings')}</span>
    </a>
  </nav>
</div>
