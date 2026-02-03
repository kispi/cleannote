<script lang="ts">
  import { ui } from '$lib/store/ui.svelte'

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
    confirmText = '확인',
    cancelText = '취소',
    isDanger = false,
    onConfirm
  }: Props = $props()

  const handleConfirm = async () => {
    await onConfirm()
    ui.modal.close()
  }
</script>

<div class="modal-confirm w-full rounded-2xl bg-white p-6 shadow-xl">
  <h3 class="mb-2 text-xl font-bold text-gray-900">{title}</h3>
  <p class="mb-6 text-sm text-gray-500">{message}</p>

  <div class="flex gap-3">
    <button class="btn-default flex-1" onclick={() => ui.modal.close()}>
      {cancelText}
    </button>
    <button class="flex-1 {isDanger ? 'btn-danger' : 'btn-primary'}" onclick={handleConfirm}>
      {confirmText}
    </button>
  </div>
</div>
