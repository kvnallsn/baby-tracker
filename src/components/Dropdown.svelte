<style>

</style>

<script lang="ts">
  // Component imports
  import { fade, slide } from "svelte/transition";

  // Component props
  export let text: string;
  export let color: string = "gray";
  let clazz;
  export { clazz as class };

  // Component local variables / definitions
  let visible: boolean = false;
</script>

<div class="{`relative inline-block text-left ${clazz || ''}`}">
  <div>
    <span class="rounded-md shadow-sm">
      <button
        type="button"
        on:click="{(_e) => (visible = !visible)}"
        class="inline-flex justify-center w-full rounded-md border
        border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium
        text-gray-700 hover:text-gray-500 focus:outline-none
        focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50
        active:text-gray-800 transition ease-in-out duration-150"
        id="options-menu"
        aria-haspopup="true"
        aria-expanded="true"
      >
        {text}
        <svg class="-mr-1 ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414
            1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
    </span>
  </div>

  {#if visible}
    <div
      class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg"
      transition:fade
    >
      <div class="rounded-md bg-white shadow-xs">
        <div
          class="py-1"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <slot />
        </div>
      </div>
    </div>
  {/if}
</div>
