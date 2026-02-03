<script lang="ts">
  import { LogOut, ChevronRight, User, Palette, Globe } from 'lucide-svelte'
  import { t } from '$lib/i18n'
  import { ui } from '$lib/store/ui.svelte'
  import { settings, type Theme, type Locale } from '$lib/store/settings.svelte'
  import ModalConfirm from '$lib/components/modals/ModalConfirm.svelte'

  let { data } = $props()

  const themes: { value: Theme; label: string }[] = [
    { value: 'light', label: 'settings.theme_options.light' },
    { value: 'dark', label: 'settings.theme_options.dark' }
  ]

  const locales: { value: Locale; label: string }[] = [
    { value: 'ko', label: 'settings.language_options.ko' },
    { value: 'en', label: 'settings.language_options.en' }
  ]

  const handleLogout = () => {
    ui.modal.show({
      component: ModalConfirm,
      props: {
        title: t('settings.logout_confirm.title'),
        message: t('settings.logout_confirm.message'),
        confirmText: t('settings.logout_confirm.confirm'),
        cancelText: t('common.cancel'),
        isDanger: true,
        onConfirm: async () => {
          const form = document.getElementById('logout-form') as HTMLFormElement
          if (form) form.submit()
          ui.modal.close()
        }
      }
    })
  }
</script>

<div class="p-6 pb-24">
  <header class="mb-8">
    <h1 class="text-base-content text-2xl font-bold">{t('settings.title')}</h1>
  </header>

  <!-- Profile Section -->
  <div
    class="border-base bg-base-100 mb-8 flex items-center gap-4 rounded-2xl border p-4 shadow-sm"
  >
    {#if data.user.avatar_url}
      <img src={data.user.avatar_url} alt="Profile" class="h-14 w-14 rounded-full bg-gray-200" />
    {:else}
      <div
        class="bg-base-200 text-sub-content flex h-14 w-14 items-center justify-center rounded-full"
      >
        <User />
      </div>
    {/if}
    <div>
      <h2 class="text-base-content text-lg font-bold">{data.user.name}</h2>
      <p class="text-sub-content text-xs">{data.user.email || 'User'}</p>
    </div>
  </div>

  <!-- Settings -->
  <div class="space-y-6">
    <!-- Theme -->
    <div class="border-base bg-base-100 flex flex-col gap-3 rounded-xl border p-4 shadow-sm">
      <div class="flex items-center gap-3">
        <div
          class="bg-base-200 text-sub-content flex h-8 w-8 items-center justify-center rounded-full"
        >
          <Palette size={18} />
        </div>
        <span class="text-base-content font-medium">{t('settings.theme')}</span>
      </div>
      <div class="bg-base-200 flex rounded-lg p-1">
        {#each themes as theme}
          <button
            type="button"
            class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all active:scale-95 {settings.theme ===
            theme.value
              ? 'bg-base-100 text-base-content shadow-sm'
              : 'text-sub-content hover:text-base-content hover:bg-gray-100 dark:hover:bg-gray-700'}"
            onclick={() => (settings.theme = theme.value)}
          >
            {t(theme.label)}
          </button>
        {/each}
      </div>
    </div>

    <!-- Language -->
    <div class="border-base bg-base-100 flex flex-col gap-3 rounded-xl border p-4 shadow-sm">
      <div class="flex items-center gap-3">
        <div
          class="bg-base-200 text-sub-content flex h-8 w-8 items-center justify-center rounded-full"
        >
          <Globe size={18} />
        </div>
        <span class="text-base-content font-medium">{t('settings.language')}</span>
      </div>
      <div class="bg-base-200 flex rounded-lg p-1">
        {#each locales as locale}
          <button
            type="button"
            class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all active:scale-95 {settings.locale ===
            locale.value
              ? 'bg-base-100 text-base-content shadow-sm'
              : 'text-sub-content hover:text-base-content hover:bg-gray-100 dark:hover:bg-gray-700'}"
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
        class="border-base bg-base-100 hover:bg-base-200 flex w-full items-center justify-between rounded-xl border p-4 shadow-sm transition-all active:scale-[0.98] dark:hover:bg-gray-800"
      >
        <span class="text-base-content font-medium">{t('settings.backup')}</span>
        <ChevronRight size={18} class="text-sub-content" />
      </button>
      <button
        class="border-base bg-base-100 hover:bg-base-200 flex w-full items-center justify-between rounded-xl border p-4 shadow-sm transition-all active:scale-[0.98] dark:hover:bg-gray-800"
      >
        <span class="text-base-content font-medium">{t('settings.terms')}</span>
        <ChevronRight size={18} class="text-sub-content" />
      </button>
    </div>
  </div>

  <form method="POST" action="/auth/logout" class="mt-8" id="logout-form">
    <button
      type="button"
      onclick={handleLogout}
      class="btn-danger w-full shadow-md transition-all hover:shadow-lg active:scale-95"
    >
      <LogOut size={18} />
      {t('settings.logout')}
    </button>
  </form>
</div>
