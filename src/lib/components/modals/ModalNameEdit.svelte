<script lang="ts">
  import { X } from 'lucide-svelte'
  import { ui } from '$lib/store/ui.svelte'
  import { t } from '$lib/i18n'
  import { createMutation, useQueryClient } from '@tanstack/svelte-query'
  import { page } from '$app/stores'

  interface Props {
    currentName: string
  }

  let { currentName }: Props = $props()
  let name = $state(currentName)

  const queryClient = useQueryClient()

  const updateMutation = createMutation(() => ({
    mutationFn: async (newName: string) => {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      })
      if (!res.ok) throw new Error()
      return res.json()
    },
    onSuccess: () => {
      ui.toast.show({ text: t('common.toast.saved'), type: 'success' })
      ui.modal.close()
      // Invalidate layout data or reloading page?
      // Since user data is in layout, we might need to reload or invalidate.
      location.reload() // Simple way to refresh layout data for now
    },
    onError: () => {
      ui.toast.show({ text: t('common.toast.error'), type: 'error' })
    }
  }))

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    if (!name) return
    updateMutation.mutate(name)
  }
</script>

<div class="modal-name-edit bg-base-100 relative w-full p-6">
  <div class="mb-6 flex items-center justify-between">
    <h2 class="text-base-content text-xl font-bold">
      {t('settings.edit_profile')}
    </h2>
    <button
      type="button"
      onclick={() => ui.modal.close()}
      class="text-sub-content hover:bg-base-200 hover:text-base-content cursor-pointer rounded-full p-2 transition-colors"
    >
      <X size={20} />
    </button>
  </div>

  <form onsubmit={handleSubmit} class="space-y-6">
    <div>
      <label for="name" class="text-base-content mb-2 block text-sm font-medium">
        {t('settings.name')}
      </label>
      <input
        type="text"
        id="name"
        bind:value={name}
        class="border-base bg-base-100 text-base-content placeholder:text-sub-content w-full rounded-xl border px-4 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        placeholder={t('settings.placeholder.name')}
      />
    </div>

    <button
      type="submit"
      class="btn-primary w-full rounded-xl"
      disabled={!name || updateMutation.isPending}
    >
      {t('common.save')}
    </button>
  </form>
</div>
