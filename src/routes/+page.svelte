<script lang="ts">
  import LoginButton from '$lib/components/auth/LoginButton.svelte'
  import { fly } from 'svelte/transition'
  import { metadata } from '$lib/metadata'
</script>

<svelte:head>
  <title>{metadata.title}</title>
  <meta name="description" content={metadata.description} />
  <meta property="og:site_name" content={metadata.siteName} />
  <meta property="og:title" content={metadata.title} />
  <meta property="og:description" content={metadata.description} />
  <meta property="og:url" content={metadata.url} />
  <meta property="og:image" content={metadata.image} />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div
  class="page-home flex min-h-screen flex-col items-center justify-between overflow-hidden bg-white px-6 pt-20 pb-12"
>
  <!-- Decorative Elements -->
  <div class="fixed -top-20 -right-20 h-64 w-64 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>
  <div class="fixed bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>

  <!-- Hero Section -->
  <div class="relative z-10 flex flex-col items-center text-center">
    <div
      class="mb-8 overflow-hidden rounded-2xl shadow-xl shadow-blue-100/50"
      in:fly={{ y: 20, duration: 800, delay: 200 }}
    >
      <img src="/favicon.jpeg" alt="Cleannote" class="h-32 w-32 object-cover" />
    </div>

    <div
      class="mb-6 inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 ring-1 ring-blue-100"
      in:fly={{ y: 20, duration: 800, delay: 300 }}
    >
      <span class="mr-1.5 text-xs">✨</span> 건물 청소 매출 관리의 정석
    </div>

    <h1
      class="text-4xl leading-tight font-extrabold tracking-tight text-gray-900"
      in:fly={{ y: 20, duration: 800, delay: 400 }}
    >
      클린노트<br />
      <span class="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
        >매출이 한눈에</span
      >
    </h1>

    <p
      class="mt-6 max-w-[280px] text-lg leading-relaxed text-gray-500"
      in:fly={{ y: 20, duration: 800, delay: 500 }}
    >
      번거로운 장부 정리 없이<br />
      오늘 청소와 이번 달 매출을<br />
      가장 직관적으로 관리하세요.
    </p>
  </div>

  <!-- Bottom Action -->
  <div
    class="relative z-10 w-full max-w-sm space-y-6"
    in:fly={{ y: 20, duration: 800, delay: 600 }}
  >
    <div class="rounded-3xl bg-gray-50/50 p-1 ring-1 ring-gray-100 backdrop-blur-sm">
      <LoginButton />
    </div>

    <!-- <div class="flex flex-col items-center gap-2">
      <p class="text-center text-xs text-gray-400">
        로그인 시 <span class="underline underline-offset-2">이용약관</span> 및
        <span class="underline underline-offset-2">개인정보처리방침</span>에 동의하게 됩니다.
      </p>
    </div> -->
  </div>
</div>

<style>
  :global(body) {
    background-color: white;
  }
</style>
