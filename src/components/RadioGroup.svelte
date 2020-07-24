<script lang="ts">
  import { text } from "svelte/internal";

  // types
  interface RadioOption {
    value: string;
    text: string;
  }

  // props
  export let label: string | undefined;
  export let group: string;
  export let options: RadioOption[];

  // mutable data
  export let value = undefined;
</script>

<style>

</style>

<div class="flex flex-col space-y-1">
  {#if label}
    <span class="block text-sm leading-5 font-medium text-gray-700">
      {label}
    </span>
  {/if}
  {#each options as option}
    <div
      class="relative group flex w-full p-2 border rounded border-gray-200
      hover:bg-red-700 hover:text-white cursor-pointer"
      on:click={(_e) => value = option}>
      <span
        class="flex-1 font-normal truncate text-base sm:text-sm cursor-pointer">
        {option.text}
      </span>
      {#if value === option}
        <span
          class="text-red-500 group-hover:text-white absolute inset-y-0 right-0
          flex items-center pr-4">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0
              011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd" />
          </svg>
        </span>
      {/if}
    </div>
  {/each}
</div>
