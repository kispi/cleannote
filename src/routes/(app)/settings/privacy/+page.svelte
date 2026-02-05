<script lang="ts">
  import { ChevronLeft } from 'lucide-svelte'
  import { t } from '$lib/i18n'
</script>

<div class="page-settings-privacy flex h-full flex-col bg-gray-50 dark:bg-gray-900">
  <header class="flex items-center gap-2 p-6 pb-4">
    <a
      href="/settings"
      class="text-base-content -ml-2 rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
    >
      <ChevronLeft size={24} />
    </a>
    <h1 class="text-base-content text-xl font-bold">{t('settings.privacy')}</h1>
  </header>

  <div class="text-base-content flex-1 overflow-y-auto p-6 pt-0">
    <div class="prose dark:prose-invert prose-sm">
      <h3>1. 개인정보 수집 항목</h3>
      <p>
        서비스는 회원가입 및 원활한 고객상담, 각종 서비스의 제공을 위해 아래와 같은 개인정보를
        수집하고 있습니다.
        <br />- 필수항목 : 이메일
      </p>

      <h3>2. 개인정보 수집 및 이용 목적</h3>
      <p>
        CleanNote는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
        <br />- 서비스 제공(로그인, 청소 기록 관리)
        <br />- 회원 관리(본인확인, 부정이용 방지)
      </p>

      <h3>3. 개인정보의 보유 및 이용기간</h3>
      <p>
        이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다.
        단, 회원이 탈퇴를 요청하거나 개인정보 동의를 철회하는 경우 즉시 파기합니다.
      </p>

      <p class="mt-8 text-sm text-gray-400">
        공고일자: 2026-02-05
        <br />시행일자: 2026-02-05
      </p>
    </div>
  </div>
</div>
