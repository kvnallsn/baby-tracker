<script lang="ts">
  // Component imports
  import { createEventDispatcher } from "svelte";
  import { fly, fade } from "svelte/transition";
  import Button from "./Button.svelte";

  // Component props
  export let open: boolean;
  export let title: string;
  export let subtitle: string;

  // Component local variables / definitions
  const dispatch = createEventDispatcher();

  // emitted when the drawer is being closed
  function close() {
    dispatch("close");
  }

  // emitted when the success/create button is clicked
  function success() {
    dispatch("success");
  }

  // emitted when the cancel button is clicked
  function cancel() {
    dispatch("cancel");
  }
</script>

<style>

</style>

{#if open}
  <div class="fixed inset-0 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <!-- Background overlay -->
      <div
        class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        transition:fade={{ duration: 300 }} />
      <section
        class="absolute inset-y-0 right-0 pl-10 max-w-full flex"
        transition:fly={{ x: 200, duration: 300 }}>
        <!-- Slide-over panel, show/hide based on slide-over state -->
        <div class="relative w-screen max-w-md">
          <!-- Close button, show/hide based on slide-over state -->
          <div class="absolute top-0 left-0 -ml-8 pt-4 pr-2 sm:-ml-10 sm:pr-4">
            <button
              on:click={close}
              aria-label="Close panel"
              class="text-gray-300 hover:text-white transition ease-in-out
              duration-150">
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div
            class="h-full flex flex-col space-y-6 bg-white shadow-xl
            overflow-y-scroll">
            <header
              class="flex flex-col justify-center h-24 bg-red-700 px-4 sm:px-6">
              <h2 class="text-lg leading-7 font-medium text-white">{title}</h2>
              <p class="text-sm text-gray-300">{subtitle}</p>
            </header>
            <div class="relative flex-1 px-4 sm:px-6">
              <!-- Panel Content-->
              <slot />
            </div>
            <footer
              class="flex justify-end items-center h-16 border-t border-gray-300
              shadow-sm space-x-4 px-4 sm:px-6">
              <Button text="Cancel" on:click={cancel} />
              <Button text="Create" color="blue" on:click={success} />
            </footer>
          </div>
        </div>
      </section>
    </div>
  </div>
{/if}
