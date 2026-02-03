<script lang="ts">
  import { ui } from '$lib/store/ui.svelte'
  import { t } from '$lib/i18n'

  interface Props {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    isDanger?: boolean
    onConfirm: () => void | Promise<void>
  }

  let {
    title,
    message,
    confirmText = t('common.confirm'),
    cancelText = t('common.cancel'),
    isDanger = false,
    onConfirm
  }: Props = $props()

  const handleConfirm = async () => {
    await onConfirm()
    ui.modal.close()
  }
</script>

<div class="modal-confirm bg-base-100 w-full p-6">
  <h3 class="text-base-content mb-2 text-xl font-bold">{title}</h3>
  <p class="text-sub-content mb-6 text-sm">{message}</p>

  <div class="flex gap-3">
    <button class="btn-default flex-1" onclick={() => ui.modal.close()}>
      {cancelText}
    </button>
    <button class="flex-1 {isDanger ? 'btn-danger' : 'btn-primary'}" onclick={handleConfirm}>
      {confirmText}
    </button>
  </div>
</div>
