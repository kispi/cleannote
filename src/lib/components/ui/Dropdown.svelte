<script lang="ts">
  import { ChevronDown } from 'lucide-svelte'
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

<div class="dropdown {className} relative" use:clickOutsideAction>
  <button
    type="button"
    class="border-base bg-base-100 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none {isOpen
      ? 'border-blue-500 ring-1 ring-blue-500'
      : ''}"
    onclick={toggle}
  >
    <span class={!value ? 'text-sub-content' : 'text-base-content'}>
      {selectedLabel}
    </span>
    <ChevronDown
      size={18}
      class="transition-transform {isOpen ? 'rotate-180' : ''} text-sub-content"
    />
  </button>

  {#if isOpen}
    <div
      class="border-base bg-base-100 absolute top-full right-0 left-0 z-50 mt-1 max-h-60 overflow-auto rounded-xl border shadow-xl"
      transition:slide={{ duration: 150 }}
    >
      {#each options as opt}
        <button
          type="button"
          class="text-base-content flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 {value ===
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
        </button>
      {/each}

      {#if options.length === 0}
        <div class="text-sub-content px-4 py-3 text-sm">No options</div>
      {/if}
    </div>
  {/if}
</div>
