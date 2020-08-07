<script lang="ts">
  // npm imports
  import { createEventDispatcher } from 'svelte';

  // props
  export let left: string;
  export let right: string;
  export let value = left;

  // local variables
  const dispatch = createEventDispatcher();

  function onToggleClick() {
    value = (value === left) ? right : left;

    dispatch('click', { value: value });
  }
</script>

<style>
  .toggle {
    @apply inline-flex items-center transition-colors duration-300 ease-in rounded-l-full px-3 py-1 text-sm;
  }

  .toggle:hover {
    @apply text-primary-400;
  }

  .toggle:focus {
    @apply outline-none text-primary-400;
  }

  .active {
    @apply bg-white text-primary-400 rounded-full;
  }
</style>

<div
  class="bg-gray-200 text-sm text-gray-500 leading-none border-2 border-gray-200 rounded-full inline-flex"
  >
  <button class="toggle" class:active={value === left} on:click={onToggleClick}>
    <span>{left}</span>
  </button>

  <button class="toggle" class:active={value === right} on:click={onToggleClick}>
    <span>{right}</span>
  </button>

</div>
