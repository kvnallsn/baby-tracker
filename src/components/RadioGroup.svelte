<script lang="ts">
  import { text } from "svelte/internal";
  import Checkmark from "./overlays/Checkmark.svelte";

  // types
  interface RadioOption {
    value: string;
    text: string;
  }

  // props
  export let label: string | undefined = undefined;
  export let name: string | undefined = undefined;
  export let options: RadioOption[];

  // mutable data
  export let value = undefined;
</script>

<style>

</style>

<div {name} class="flex flex-col space-y-1">
  {#if label}
    <span class="block text-sm leading-5 font-medium text-gray-700">
      {label}
    </span>
  {/if}
  {#each options as option}
    <div
      class="relative group flex w-full p-2 border rounded border-gray-200
      hover:bg-primary-700 hover:text-white cursor-pointer"
      on:click={(_e) => value = option.value}>
      <span
        class="flex-1 font-normal truncate text-base sm:text-sm cursor-pointer">
        {option.text}
      </span>
      {#if value === option.value}
        <Checkmark position="right" />
      {/if}
    </div>
  {/each}
</div>
