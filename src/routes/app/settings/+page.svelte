<script lang="ts">
  import { LogOut, ChevronRight, User, Palette, Globe } from 'lucide-svelte'
  import { t } from '$lib/i18n'
  import { settings, type Theme, type Locale } from '$lib/store/settings.svelte'

  let { data } = $props()

  const themes: { value: Theme; label: string }[] = [
    { value: 'light', label: 'settings.theme_options.light' },
    { value: 'dark', label: 'settings.theme_options.dark' }
  ]

  const locales: { value: Locale; label: string }[] = [
    { value: 'ko', label: 'settings.language_options.ko' },
    { value: 'en', label: 'settings.language_options.en' }
  ]
</script>

<div class="p-6 pb-24">
  <header class="mb-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{t('settings.title')}</h1>
  </header>

  <!-- Profile Section -->
  <div
    class="mb-8 flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
  >
    {#if data.user.avatar_url}
      <img src={data.user.avatar_url} alt="Profile" class="h-14 w-14 rounded-full bg-gray-200" />
    {:else}
      <div
        class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800"
      >
        <User />
      </div>
    {/if}
    <div>
      <h2 class="text-lg font-bold dark:text-white">{data.user.name}</h2>
      <p class="text-xs text-gray-500 dark:text-gray-400">{data.user.email || 'User'}</p>
    </div>
  </div>

  <!-- Settings -->
  <div class="space-y-6">
    <!-- Theme -->
    <div
      class="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
        >
          <Palette size={18} />
        </div>
        <span class="font-medium text-gray-700 dark:text-gray-200">{t('settings.theme')}</span>
      </div>
      <div class="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {#each themes as theme}
          <button
            type="button"
            class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all {settings.theme ===
            theme.value
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}"
            onclick={() => (settings.theme = theme.value)}
          >
            {t(theme.label)}
          </button>
        {/each}
      </div>
    </div>

    <!-- Language -->
    <div
      class="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
        >
          <Globe size={18} />
        </div>
        <span class="font-medium text-gray-700 dark:text-gray-200">{t('settings.language')}</span>
      </div>
      <div class="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {#each locales as locale}
          <button
            type="button"
            class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all {settings.locale ===
            locale.value
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400'}"
            onclick={() => (settings.locale = locale.value)}
          >
            {t(locale.label)}
          </button>
        {/each}
      </div>
    </div>

    <!-- Other Links -->
    <div class="space-y-3">
      <button
        class="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-transform active:scale-[0.99] dark:border-gray-800 dark:bg-gray-900"
      >
        <span class="font-medium text-gray-700 dark:text-gray-200">{t('settings.backup')}</span>
        <ChevronRight size={18} class="text-gray-400" />
      </button>
      <button
        class="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-transform active:scale-[0.99] dark:border-gray-800 dark:bg-gray-900"
      >
        <span class="font-medium text-gray-700 dark:text-gray-200">{t('settings.terms')}</span>
        <ChevronRight size={18} class="text-gray-400" />
      </button>
    </div>
  </div>

  <form method="POST" action="/auth/logout" class="mt-8">
    <button
      type="submit"
      class="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 p-4 font-medium text-red-500 transition-transform active:scale-95 dark:bg-red-900/20 dark:text-red-400"
    >
      <LogOut size={18} />
      {t('settings.logout')}
    </button>
  </form>
</div>
