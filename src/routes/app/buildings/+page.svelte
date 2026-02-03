<script lang="ts">
  import { Plus } from 'lucide-svelte'
</script>

<div class="relative min-h-[calc(100vh-80px)] p-6">
  <header class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">내 건물 관리</h1>
    <p class="text-sm text-gray-500">총 12개 건물을 관리하고 있어요.</p>
  </header>

  <div class="space-y-4">
    <!-- Building List Item (Mock) -->
    <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div class="mb-2 flex items-start justify-between">
        <h3 class="text-lg font-bold">강남 빌라 101호</h3>
        <span class="text-sm font-bold text-blue-600">8만원</span>
      </div>
      <div class="mb-3 flex gap-2 text-xs text-gray-500">
        <span class="rounded bg-gray-100 px-2 py-1">월, 수, 금</span>
        <span class="rounded bg-gray-100 px-2 py-1">청소시간 30분</span>
      </div>
      <p class="truncate text-xs text-gray-400">서울 강남구 역삼동 123-45</p>
    </div>

    <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div class="mb-2 flex items-start justify-between">
        <h3 class="text-lg font-bold">서초 자이 상가</h3>
        <span class="text-sm font-bold text-blue-600">15만원</span>
      </div>
      <div class="mb-3 flex gap-2 text-xs text-gray-500">
        <span class="rounded bg-gray-100 px-2 py-1">화, 목</span>
      </div>
      <p class="truncate text-xs text-gray-400">서울 서초구 서초동 555</p>
    </div>
  </div>

  <!-- Floating Action Button -->
  <button
    class="fixed right-6 bottom-20 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-300 transition-transform active:scale-95"
  >
    <Plus />
  </button>
</div>
