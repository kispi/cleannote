<script lang="ts">
  import { ChevronDown, Check } from 'lucide-svelte'
  import { slide } from 'svelte/transition'

  interface Option {
    value: any
    label: string
    [key: string]: any
  }

  interface Props {
    value: any
    options: Option[]
    placeholder?: string
    class?: string
    renderOption?: import('svelte').Snippet<[Option]>
  }

  let {
    value = $bindable(),
    options,
    placeholder = 'Select...',
    class: className,
    renderOption
  }: Props = $props()

  let isOpen = $state(false)
  let selectedLabel = $derived(options.find((o) => o.value === value)?.label || placeholder)

  function toggle() {
    isOpen = !isOpen
  }

  function select(opt: Option) {
    value = opt.value
    isOpen = false
  }

  // Click outside simple implementation
  function clickOutsideAction(node: HTMLElement) {
    const handleClick = (event: MouseEvent) => {
      if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
        isOpen = false
      }
    }
    document.addEventListener('click', handleClick, true)
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true)
      }
    }
  }
</script>

<div class="{className} relative" use:clickOutsideAction>
  <button
    type="button"
    class="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none active:scale-[0.99] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
    onclick={toggle}
  >
    <span class={!value ? 'text-gray-400' : 'text-gray-900 dark:text-white'}>
      {selectedLabel}
    </span>
    <ChevronDown
      size={18}
      class="text-gray-400 transition-transform {isOpen ? 'rotate-180' : ''}"
    />
  </button>

  {#if isOpen}
    <div
      class="absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-auto rounded-xl border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
      transition:slide={{ duration: 150 }}
    >
      {#each options as opt}
        <button
          type="button"
          class="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 {value ===
          opt.value
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
            : ''}"
          onclick={() => select(opt)}
        >
          {#if renderOption}
            {@render renderOption(opt)}
          {:else}
            <span>{opt.label}</span>
          {/if}

          {#if value === opt.value}
            <Check size={16} class="text-blue-600 dark:text-blue-400" />
          {/if}
        </button>
      {/each}

      {#if options.length === 0}
        <div class="px-4 py-3 text-sm text-gray-400">No options</div>
      {/if}
    </div>
  {/if}
</div>
