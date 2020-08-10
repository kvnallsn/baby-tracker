<script lang="ts">
  // action imports
  import { clickAway } from '~/actions/clickAway.ts';

  // Properties
  export let text: string | undefined = undefined;      // Text to display on button (optional, slot available)
  export let color: string = "white";                   // Color of this button, default is "white".
  export let full: boolean = false;                     // Switch to toggle if this button should take the full width of it's parent, default if false
  export let type: string = "button";                   // what type of button this is ("button", "submit", etc)
</script>

<style>
  .white {
    @apply border-gray-300 bg-white text-gray-700;
  }

  .white:hover {
    @apply text-gray-500;
  }

  .white:focus {
    @apply border-blue-300 shadow-outline-blue;
  }

  .white:active {
    @apply text-gray-800 bg-gray-50;
  }

  .blue {
    @apply border-gray-300 bg-blue-700 text-white;
  }

  .blue:hover {
    @apply bg-blue-600;
  }

  .blue:focus {
    @apply border-blue-300 shadow-outline-blue;
  }

  .blue:active {
    @apply text-blue-800 bg-blue-500;
  }

  .primary {
    @apply border-gray-300 bg-primary-700 text-white;
  }

  .primary:hover {
    @apply bg-primary-600;
  }

  .primary:focus {
    @apply border-primary-300 outline-none;
  }

  .primary:active {
    @apply text-primary-200 bg-primary-500;
  }
</style>

<div class="relative inline-block text-left" class:w-full={full}>
  <span class="rounded-md shadow-sm">
    <button
      use:clickAway
      {type}
      on:click
      on:click_away
      class={`inline-flex justify-center w-full rounded-md border px-4 py-2
      text-sm leading-5 font-medium focus:outline-none transition ease-in-out
      duration-150 ${color || ''}`}
      {...$$restProps}>
      {#if text}
        {text}
      {:else}
        <slot></slot>
      {/if}
    </button>
  </span>
</div>
