<script lang="ts">
  // Component imports

  // Component props
  export let text: string;                    // text to display
  export let color: string = "primary";       // hover color

  // Component local variables / definitions
</script>

<style>
  .primary:hover {
    @apply bg-primary-500 text-gray-100;
  }
</style>

<button
  type="button"
  class={`block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700
  focus:outline-none focus:bg-gray-100 focus:text-gray-900 rounded-sm ${color}`}
  role="menuitem"
  on:click
>
    {text}
</button>
