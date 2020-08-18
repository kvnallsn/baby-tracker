<script lang="ts">
  // npm imports
  import { fade, slide } from "svelte/transition";

  // component imports
  import Button from "~/components/Button.svelte";

  // Component props
  export let text: string;

  // work around to export class attribute
  let clazz = undefined;
  export { clazz as class };

  // Component local variables / definitions
  let visible: boolean = false;
</script>

<style>
  .primary {
  }
</style>

<div class="{`relative inline-block text-left ${clazz || ''}`}">
  <Button
    color="primary"
    id="options-menu"
    aria-haspopup="true"
    aria-expanded="true"
    on:click="{() => visible = !visible}"
    on:click_away="{() => visible = false}">
      {text}
    <svg class="-mr-1 ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fill-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414
        1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clip-rule="evenodd"
      ></path>
    </svg>
  </Button>

  {#if visible}
    <div
      class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg"
      transition:fade="{{ duration: 100 }}"
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
