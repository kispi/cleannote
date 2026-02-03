<script lang="ts">
  import { MessageCircle } from 'lucide-svelte'
  import { t } from '$lib/i18n'
</script>

<button
  type="button"
  onclick={() => {
    const width = 500
    const height = 600
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2
    window.open(
      '/auth/kakao/login',
      'kakao_login',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
    )
  }}
  class="login-button flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[#FEE500] px-6 py-4 text-black transition-transform active:scale-95"
>
  <MessageCircle class="h-6 w-6 fill-black" />
  <span class="text-lg font-bold">{$t('login.kakao')}</span>
</button>
