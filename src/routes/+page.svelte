<script lang="ts">
  import LoginButton from '$lib/components/auth/LoginButton.svelte'
  import { ArrowRight, Sparkles } from 'lucide-svelte'
  import { fade, fly } from 'svelte/transition'
</script>

<div class="flex min-h-screen flex-col items-center justify-between bg-white px-6 py-12">
  <!-- Hero Section -->
  <div class="mt-12 flex flex-col items-center text-center">
    <div
      class="mb-6 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600"
      in:fly={{ y: 20, duration: 800, delay: 200 }}
    >
      <span class="mr-1">✨</span> 계단 청소 수익 관리의 정석
    </div>

    <h1
      class="text-4xl leading-tight font-extrabold tracking-tight text-gray-900"
      in:fly={{ y: 20, duration: 800, delay: 300 }}
    >
      클린노트<br />
      <span class="text-blue-600">수익이 한눈에</span>
    </h1>

    <p class="mt-4 max-w-xs text-lg text-gray-500" in:fly={{ y: 20, duration: 800, delay: 400 }}>
      복잡한 장부 정리 없이<br />
      오늘 청소와 이번 달 수익을<br />
      가장 직관적으로 관리하세요.
    </p>
  </div>

  <!-- Feature Graphic / Placeholder -->
  <div
    class="flex w-full max-w-xs items-center justify-center py-8"
    in:fade={{ duration: 1000, delay: 500 }}
  >
    <div class="relative aspect-square w-64 rounded-xl bg-gray-50 p-6 shadow-inner">
      <div class="absolute inset-x-6 top-6 h-32 space-y-2 rounded-xl bg-white p-4 shadow-lg">
        <div class="h-4 w-1/2 rounded bg-gray-100"></div>
        <div class="h-4 w-3/4 rounded bg-gray-100"></div>
      </div>
      <div
        class="absolute inset-x-6 bottom-6 flex h-16 items-center justify-center rounded-xl bg-blue-500 font-bold text-white opacity-90 shadow-lg"
      >
        이번 달 +120만원
      </div>
    </div>
  </div>

  <!-- Bottom Action -->
  <div class="w-full space-y-4" in:fly={{ y: 20, duration: 800, delay: 600 }}>
    <LoginButton />
    <p class="text-center text-xs text-gray-400">
      로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
    </p>
  </div>
</div>
