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
<div class="layout-app flex h-[100dvh] flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
  <div class="relative flex-1 overflow-hidden">
    {@render children?.()}
  </div>

  <!-- Bottom Navigation -->
  <nav
    class="flex w-full items-center justify-between rounded-t-3xl bg-white/95 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-t dark:border-gray-800 dark:bg-gray-900/95"
  >
    <a
      href="/"
      class="group flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 {activeClass(
        '/'
      )}"
    >
      <Home size={24} class="transition-transform group-active:scale-95" />
      <span class="text-[10px] font-medium">{t('nav.home')}</span>
    </a>
    <a
      href="/buildings"
      class="group flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 {activeClass(
        '/buildings'
      )}"
    >
      <Building size={24} class="transition-transform group-active:scale-95" />
      <span class="text-[10px] font-medium">{t('nav.buildings')}</span>
    </a>
    <a
      href="/settings"
      class="group flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 {activeClass(
        '/settings'
      )}"
    >
      <Settings size={24} class="transition-transform group-active:scale-95" />
      <span class="text-[10px] font-medium">{t('nav.settings')}</span>
    </a>
  </nav>
</div>
