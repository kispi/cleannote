<script lang="ts">
  import type { Snippet } from 'svelte'

  interface Props {
    label?: string
    id?: string
    error?: string
    class?: string
    children: Snippet
    leftIcon?: Snippet
    rightIcon?: Snippet
    labelRight?: Snippet
  }

  let {
    label,
    id,
    error,
    class: className = '',
    children,
    leftIcon,
    rightIcon,
    labelRight
  }: Props = $props()
</script>

<div class={className}>
  {#if label}
    <div class="mb-2 flex items-center justify-between">
      <label for={id} class="text-base-content block text-sm font-medium">
        {label}
      </label>
      {#if labelRight}
        {@render labelRight()}
      {/if}
    </div>
  {/if}

  <div
    class="border-base bg-base-100 flex items-center gap-2 rounded-xl border px-4 py-3 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500"
  >
    {#if leftIcon}
      <div class="text-sub-content flex items-center justify-center">
        {@render leftIcon()}
      </div>
    {/if}

    <div class="flex-1">
      {@render children()}
    </div>

    {#if rightIcon}
      <div class="text-sub-content flex items-center justify-center">
        {@render rightIcon()}
      </div>
    {/if}
  </div>

  {#if error}
    <p class="text-error mt-1 text-xs">{error}</p>
  {/if}
</div>

<style>
  /* Ensure the input passed in children takes full width and has no default border */
  :global(.input-wrapper-child) {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    margin: 0;
  }
  :global(.input-wrapper-child:focus) {
    box-shadow: none;
    outline: none;
  }
</style>
