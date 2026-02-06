<script lang="ts">
  import { korPrice } from '$lib/utils/format'

  interface Props {
    value: number
    label: string
    id?: string
    placeholder?: string
  }

  let { value = $bindable(), label, id = 'price', placeholder = '0' }: Props = $props()
</script>

<div class="form-price">
  <label for={id} class="text-base-content mb-2 block text-sm font-medium">
    {label}
  </label>
  <div class="relative">
    <input
      type="number"
      {id}
      bind:value
      class="border-base bg-base-100 text-base-content w-full rounded-xl border px-4 py-3 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      {placeholder}
      oninput={(e) => {
        const target = e.target as HTMLInputElement
        let val = Number(target.value)
        if (val > 99999999) {
          val = 99999999
          target.value = '99999999'
          value = 99999999
        }
      }}
      onpaste={(e) => {
        // Prevent pasting non-numeric or huge numbers
        const paste = (e.clipboardData || (window as any).clipboardData).getData('text')
        if (!/^\d+$/.test(paste) || Number(paste) > 99999999) {
          e.preventDefault()
          // Optional: manually insert clamped value?
          // Simpler to just let input event handle clamp if it passes, but paste might bypass if we prevent default?
          // Actually, let standard paste happen and let oninput catch it is often easier,
          // but early prevention is better for UX.
          // User asked for validation on change.
          // Simplest is to rely on oninput which triggers after paste.
          // But explicitly:
        }
      }}
      onkeydown={(e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          const next = Math.floor(value / 1000) * 1000 + 1000
          value = next > 99999999 ? 99999999 : next
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          const next = Math.ceil(value / 1000) * 1000 - 1000
          value = next < 0 ? 0 : next
        }
      }}
    />
  </div>
  <div class="mt-2 flex items-center gap-3">
    <div class="flex gap-2 overflow-x-auto">
      {#each [10000, 50000, 100000] as amount}
        <button
          type="button"
          onclick={() => {
            const next = value + amount
            value = next > 99999999 ? 99999999 : next
          }}
          class="bg-base-200 text-sub-content rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          +{amount.toLocaleString()}
        </button>
      {/each}
    </div>
    {#if value > 0}
      <span
        class="ml-auto min-w-[100px] text-right text-sm font-bold whitespace-nowrap text-blue-600 dark:text-blue-400"
      >
        {korPrice(value)}
      </span>
    {/if}
  </div>
</div>
