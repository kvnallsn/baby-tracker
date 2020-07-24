<script lang="ts">
    // imports
    import { createEventDispatcher } from "svelte";

    // props
    export let title: string;
    export let selected: boolean = false;
    export let id: number;

    // local variables
    const dispatch = createEventDispatcher();

    function clicked() {
        dispatch('click', {
            id, title
        });
    }
</script>

<style>

</style>

<!--
Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

Highlighted: "text-white bg-indigo-600", Not Highlighted: "text-gray-900"
-->
<li
  id="{`listbox-item-{id}`}"
  on:click={clicked}
  role="option"
  class="group text-gray-900 hover:bg-red-500 hover:text-white cursor-default select-none relative py-2 pl-3 pr-9">
  <div class="flex items-center space-x-3">
    <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
    <span class="font-normal block truncate">{title}</span>
  </div>

  <!--
    Checkmark, only display for selected option.

    Highlighted: "text-white", Not Highlighted: "text-indigo-600"
  -->
  {#if selected}
    <span class="text-red-500 group-hover:text-white absolute inset-y-0 right-0 flex items-center pr-4">
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0
            011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd" />
        </svg>
    </span>
  {/if}
</li>
