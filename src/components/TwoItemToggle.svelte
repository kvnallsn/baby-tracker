<script lang="ts">
  // npm imports

  // props
  export let left: string;
  export let right: string;
  export let value = left;
 
  // local mutable data
  let toggle: boolean = false;

  function onToggleClick() {
    toggle = !toggle;
    value = toggle ? right : left;
  }
</script>

<style>
  .btn {
    @apply inline-flex items-center transition-colors duration-300 ease-in rounded-l-full px-3 py-1 text-sm;
  }

  .btn:hover {
    @apply text-primary-400;
  }

  .btn:focus {
    @apply outline-none text-primary-400;
  }

  .active {
    @apply bg-white text-primary-400 rounded-full;
  }
</style>

<div
  class="bg-gray-200 text-sm text-gray-500 leading-none border-2 border-gray-200 rounded-full inline-flex"
  >
  <button class="btn" class:active={!toggle} on:click={onToggleClick}>
    <span>{left}</span>
  </button>

  <button class="btn" class:active={toggle} on:click={onToggleClick}>
    <span>{right}</span>
  </button>

</div>
