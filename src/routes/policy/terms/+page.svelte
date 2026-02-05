<script lang="ts">
  import { ChevronLeft } from 'lucide-svelte'
  import { t } from '$lib/i18n'
</script>

<div class="page-settings-terms flex h-full flex-col bg-gray-50 dark:bg-gray-900">
  <header class="flex items-center gap-2 p-6 pb-4">
    <button
      onclick={() => history.back()}
      class="text-base-content -ml-2 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
      aria-label="Back"
    >
      <ChevronLeft size={24} />
    </button>
    <h1 class="text-base-content text-xl font-bold">{t('settings.terms')}</h1>
  </header>

  <div class="text-base-content flex-1 overflow-y-auto p-6 pt-0">
    <div class="prose dark:prose-invert prose-sm">
      <h3>1. 서비스 이용 약관</h3>
      <p>
        본 서비스 "CleanNote"는 개인용 청소 기록 및 관리 서비스입니다. 사용자의 데이터는 기기 및
        연결된 데이터베이스에 저장되며, 서비스 제공자는 이를 본래의 목적 외로 사용하지 않습니다.
      </p>

      <h3>2. 데이터 수집 및 이용</h3>
      <p>
        서비스 이용을 위해 최소한의 개인정보(이메일)를 수집할 수 있습니다. 수집된 정보는 사용자 식별
        및 서비스 제공 목적으로만 사용됩니다.
      </p>

      <h3>3. 책임의 한계</h3>
      <p>
        본 서비스는 "있는 그대로" 제공되며, 서비스 이용으로 인한 데이터 손실이나 기타 피해에 대해
        책임지지 않습니다. 중요한 데이터는 별도로 백업하시기 바랍니다.
      </p>

      <p class="mt-8 text-sm text-gray-400">최종 수정일: 2026-02-05</p>
    </div>
  </div>
</div>
