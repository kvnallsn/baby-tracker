<script lang="ts">
  // Properties
  export let text: string;                // Text to display on button, no default (required)
  export let color: string = "primary";   // Color of this button, default is "primary".
</script>

<style>
  .blue {
    @apply text-blue-700;
  }

  .blue:hover {
    @apply text-blue-500;
  }

  .blue:focus {
    @apply text-blue-900;
  }

  .blue:active {
    @apply text-black;
  }

  .primary {
    @apply text-primary-700;
  }

  .primary:hover {
    @apply text-primary-500;
  }

  .primary:focus {
    @apply text-primary-900;
  }

  .primary:active {
    @apply text-primary-900;
  }
</style>

<div class="relative inline-block text-left">
  <span class="rounded-md">
    <button
      type="button"
      on:click
      class={`inline-flex justify-center w-full rounded-md px-4 py-2
      text-sm leading-5 font-medium focus:outline-none transition ease-in-out
      duration-150 ${color || ''}`}
      aria-haspopup="true"
      aria-expanded="true">
      {text}
    </button>
  </span>
</div>
