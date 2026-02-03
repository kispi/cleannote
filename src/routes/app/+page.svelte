<script lang="ts">
  let { data } = $props()
</script>

<div class="space-y-6 p-6">
  <header class="flex items-center justify-between">
    <div>
      <p class="text-sm text-gray-500">안녕하세요,</p>
      <h1 class="text-2xl font-bold text-gray-900">{data.user.name}님 👋</h1>
    </div>
    {#if data.user.avatar_url}
      <img src={data.user.avatar_url} alt="Profile" class="h-10 w-10 rounded-full bg-gray-200" />
    {/if}
  </header>

  <div class="rounded-2xl bg-blue-600 p-6 text-white shadow-lg shadow-blue-200">
    <p class="mb-1 text-sm opacity-80">이번 달 예상 수익</p>
    <h2 class="text-3xl font-bold">1,250,000원</h2>
  </div>

  <div>
    <h3 class="mb-4 text-lg font-bold text-gray-800">오늘의 청소</h3>
    <div class="space-y-3">
      <div
        class="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
      >
        <div>
          <h4 class="font-bold text-gray-900">강남 빌라 101호</h4>
          <p class="text-xs text-gray-500">서울 강남구 역삼동</p>
        </div>
        <button class="h-8 w-8 rounded-full border-2 border-gray-200"></button>
      </div>
      <div
        class="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 opacity-50 shadow-sm"
      >
        <div>
          <h4 class="font-bold text-gray-900 line-through">서초 자이 상가</h4>
          <p class="text-xs text-gray-500">완료됨</p>
        </div>
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs text-white"
        >
          ✓
        </div>
      </div>
    </div>
  </div>
</div>
