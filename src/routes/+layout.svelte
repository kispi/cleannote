<script lang="ts">
  import '../app.css'
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
  import ModalRenderer from '$lib/components/ui/ModalRenderer.svelte'
  import ToastRenderer from '$lib/components/ui/ToastRenderer.svelte'
  import { browser } from '$app/environment'

  import { settings } from '$lib/store/settings.svelte'

  let { children } = $props()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        staleTime: 60 * 1000
      }
    }
  })

  $effect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })
</script>

<QueryClientProvider client={queryClient}>
  <!-- Mobile-first container -->
  <div
    class="layout-root bg-base-100 text-base-content min-h-screen font-sans antialiased transition-colors"
  >
    <main
      class="bg-base-100 relative mx-auto min-h-screen w-full max-w-7xl shadow-sm sm:px-6 lg:px-8"
    >
      {@render children?.()}
    </main>
    <ModalRenderer />
    <ToastRenderer />
  </div>
</QueryClientProvider>
