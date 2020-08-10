<script lang="ts">
  // imports
  import { onMount } from "svelte";

  // svg imports
  import Checkmark from "~/components/overlays/Checkmark.svelte";

  // props
  export let id: string | undefined  = undefined;
  export let name: string | undefined  = undefined;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let label: string;
  export let placeholder: string;
  export let value: number;
  export let valid: boolean = true;
</script>

<style>
  .invalid {
    @apply border border-red-700;
  }

  .valid {
    @apply border border-green-700;
  }
</style>

<div>
  <label for={id} class="block text-sm leading-5 font-medium text-gray-700">
    {label}
  </label>
  <div class="relative">
    <input
      type="number"
      {id}
      {name}
      {min}
      {max}
      bind:value
      on:change
      class="form-input block w-full pl-2 pr-2 sm:text-sm sm:leading-5"
      {placeholder} />

    {#if valid}
      <Checkmark position="right" />
    {/if}
  </div>
  <div class="leading-5 text-xs text-red-500 ml-2">
    <slot name="errors">
    </slot>
  </div>
</div>
