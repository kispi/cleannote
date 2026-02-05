<script lang="ts">
  import { Building, CheckCircle } from 'lucide-svelte'
  import { ui } from '$lib/store/ui.svelte'
  import { t } from '$lib/i18n'

  const handleConfirm = () => {
    ui.modal.close()
  }
</script>

<div class="modal-building-added bg-base-100 flex w-full flex-col items-center p-8 text-center">
  <div
    class="mb-4 rounded-full bg-blue-100 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
  >
    <Building size={48} />
  </div>

  <h2 class="text-base-content mb-2 text-xl font-bold">
    {t('building.registration_complete')}
  </h2>

  <p class="text-sub-content mb-8 text-sm whitespace-pre-line">
    {t('building.check_in_tab_message')}
  </p>

  <button class="btn-primary w-full rounded-xl" onclick={handleConfirm}>
    {t('common.confirm')}
  </button>
</div>
