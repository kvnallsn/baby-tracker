<script lang="ts">
  // imports
  import { onMount } from "svelte";
  import * as yup from "yup";

  // components
  import Checkmark from "../overlays/Checkmark.svelte";

  // props
  export let id: string;
  export let label: string;
  export let placeholder: string;
  export let value: number;
  // an optional schema to validate against
  export let schema: yup.Schema = undefined;

  let validated: bool = true;
  let errors = [];

  function validate(e) {
    if (schema) {
      schema.validate(e.target.valueAsNumber)
        .then(() => validated = true)
        .catch(e => {
          validated = false;
          errors = e.errors;
        });
    }
  }
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
      {id}
      type="number"
      bind:value
      on:change={validate}
      class="form-input block w-full pl-2 pr-2 sm:text-sm sm:leading-5"
      {placeholder} />
      {#if validated}
        <Checkmark position="right" />
      {/if}
  </div>
  {#if !validated}
    <ul class="block p-2 list-none">
      {#each errors as error}
        <li class="text-sm leading-5 font-medium text-red-700">{error}</li>
      {/each}
    </ul>
  {/if}
</div>
