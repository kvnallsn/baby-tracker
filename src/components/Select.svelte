<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import SelectItem from "./SelectItem.svelte";

  // props
  export let title: string = "Pick one";
  export let options = [];

  // local variables
  const dispatch = createEventDispatcher();
  let open: boolean = false;

  // data

  let selectedOption = options[0];

  // functions
  function selected(event) {
    selectedOption = event.detail;
    open = false;
    dispatch("selected", {
      ...event.detail,
    });
  }
</script>

<style>

</style>

<!--
  Custom select controls like this require a considerable amount of JS to implement from scratch. We're planning
  to build some low-level libraries to make this easier with popular frameworks like React, Vue, and even Alpine.js
  in the near future, but in the mean time we recommend these reference guides when building your implementation:

  https://www.w3.org/TR/wai-aria-practices/#Listbox
  https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html
-->
<div class="space-y-1">
  <label
    id="listbox-label"
    class="block text-sm leading-5 font-medium text-gray-700">
    {title}
  </label>
  <div class="relative">
    <span class="inline-block w-full rounded-md shadow-sm">
      <button
        type="button"
        on:click={(_e) => (open = !open)}
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        class="group cursor-pointer relative w-full rounded-md border
        border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none
        focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out
        duration-150 sm:text-sm sm:leading-5 hover:bg-primary-700">
        <div class="flex items-center space-x-3">
          <!-- selected item -->
          <span class="block truncate group-hover:text-white">
            {selectedOption.title}
          </span>
        </div>
        <span
          class="absolute inset-y-0 right-0 flex items-center pr-2
          pointer-events-none">
          <svg
            class="h-5 w-5 text-gray-400 group-hover:text-white"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor">
            <path
              d="M7 7l3-3 3 3m0 6l-3 3-3-3"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </span>
      </button>
    </span>

    <!-- Select popover, show/hide based on select state. -->
    {#if open}
      <div
        class="absolute mt-1 w-full rounded-md border border-primary-600 bg-white
        shadow-lg z-10">
        <ul
          tabindex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-item-3"
          class="max-h-56 rounded-md py-1 text-base leading-6 shadow-xs
          overflow-auto focus:outline-none sm:text-sm sm:leading-5">

          {#each options as option}
            <SelectItem
              {...option}
              selected={option.id === selectedOption.id}
              on:click={selected} />
          {/each}
          <!-- More options... -->
        </ul>
      </div>
    {/if}
  </div>
</div>
