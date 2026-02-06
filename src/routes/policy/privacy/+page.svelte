<script lang="ts">
  import { ChevronLeft } from 'lucide-svelte'
  import { t } from '$lib/i18n'
</script>

<div class="page-settings-privacy flex h-full flex-col bg-white dark:bg-gray-950">
  <header class="sticky top-0 z-10 flex items-center gap-2 bg-white/80 p-6 pb-4 backdrop-blur-xl dark:bg-gray-950/80">
    <button
      onclick={() => history.back()}
      class="text-gray-900 transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 -ml-2 rounded-full p-2"
      aria-label="Back"
    >
      <ChevronLeft size={24} />
    </button>
    <h1 class="text-xl font-bold text-gray-900 dark:text-white">{t('settings.privacy')}</h1>
  </header>

  <div class="flex-1 overflow-y-auto px-6 pb-12">
    <div class="mx-auto max-w-2xl py-2">
      <section class="mb-10">
        <h3 class="mb-3 text-lg font-bold text-gray-900 dark:text-white">1. 개인정보 수집 항목</h3>
        <p class="leading-relaxed text-gray-600 dark:text-gray-400">
          서비스는 회원가입 및 원활한 고객상담, 각종 서비스의 제공을 위해 아래와 같은 개인정보를
          수집하고 있습니다.
        </p>
        <ul class="mt-2 list-inside list-disc text-gray-600 dark:text-gray-400">
          <li>필수항목 : 이메일</li>
        </ul>
      </section>

      <section class="mb-10">
        <h3 class="mb-3 text-lg font-bold text-gray-900 dark:text-white">2. 개인정보 수집 및 이용 목적</h3>
        <p class="leading-relaxed text-gray-600 dark:text-gray-400">
          CleanNote는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
        </p>
        <ul class="mt-2 list-inside list-disc text-gray-600 dark:text-gray-400">
          <li>서비스 제공(로그인, 청소 기록 관리)</li>
          <li>회원 관리(본인확인, 부정이용 방지)</li>
        </ul>
      </section>

      <section class="mb-10">
        <h3 class="mb-3 text-lg font-bold text-gray-900 dark:text-white">3. 개인정보의 보유 및 이용기간</h3>
        <p class="leading-relaxed text-gray-600 dark:text-gray-400">
          이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되면 지체 없이 파기합니다.
          단, 회원이 탈퇴를 요청하거나 개인정보 동의를 철회하는 경우 즉시 파기합니다.
        </p>
      </section>

      <div class="mt-12 border-t border-gray-100 pt-8 dark:border-gray-900">
        <p class="text-sm text-gray-400 dark:text-gray-600">
          공고일자: 2026-02-05
          <br />시행일자: 2026-02-05
        </p>
      </div>
    </div>
  </div>
</div>
