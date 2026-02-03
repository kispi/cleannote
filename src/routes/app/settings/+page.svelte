<script lang="ts">
  import { LogOut, ChevronRight, User } from 'lucide-svelte'
  let { data } = $props()
</script>

<div class="p-6">
  <header class="mb-8">
    <h1 class="text-2xl font-bold text-gray-900">설정</h1>
  </header>

  <!-- Profile Section -->
  <div
    class="mb-8 flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
  >
    {#if data.user.avatar_url}
      <img src={data.user.avatar_url} alt="Profile" class="h-14 w-14 rounded-full bg-gray-200" />
    {:else}
      <div
        class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400"
      >
        <User />
      </div>
    {/if}
    <div>
      <h2 class="text-lg font-bold">{data.user.name}</h2>
      <p class="text-xs text-gray-500">{data.user.email || '카카오 로그인 사용자'}</p>
    </div>
  </div>

  <!-- Menus -->
  <div class="space-y-4">
    <button
      class="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      <span class="font-medium text-gray-700">데이터 백업 / 내보내기</span>
      <ChevronRight size={18} class="text-gray-400" />
    </button>
    <button
      class="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      <span class="font-medium text-gray-700">이용약관</span>
      <ChevronRight size={18} class="text-gray-400" />
    </button>
  </div>

  <form method="POST" action="/auth/logout" class="mt-8">
    <button
      type="submit"
      class="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 p-4 font-medium text-red-500 transition-transform active:scale-95"
    >
      <LogOut size={18} />
      로그아웃
    </button>
  </form>
</div>
