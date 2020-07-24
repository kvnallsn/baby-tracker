<script lang="ts">
  // Properties
  export let text: string;
  export let color: string = "white";
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
</style>

<div class="relative inline-block text-left">
  <div>
    <span class="rounded-md shadow-sm">
      <button
        type="button"
        on:click
        class={`inline-flex justify-center w-full rounded-md border px-4 py-2
        text-sm leading-5 font-medium focus:outline-none transition ease-in-out
        duration-150 ${color || ''}`}
        id="options-menu"
        aria-haspopup="true"
        aria-expanded="true">
        {text}
      </button>
    </span>
  </div>
</div>
