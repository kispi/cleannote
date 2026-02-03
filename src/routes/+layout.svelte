<script lang="ts">
  import '../app.css'
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
  import ModalRenderer from '$lib/components/ui/ModalRenderer.svelte'
  import ToastRenderer from '$lib/components/ui/ToastRenderer.svelte'
  import { browser } from '$app/environment'

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
        staleTime: 60 * 1000
      }
    }
  })
</script>

<QueryClientProvider client={queryClient}>
  <!-- Mobile-first container -->
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
    <main class="relative mx-auto min-h-screen w-full max-w-7xl bg-white shadow-sm sm:px-6 lg:px-8">
      <slot />
    </main>
    <ModalRenderer />
    <ToastRenderer />
  </div>
</QueryClientProvider>
