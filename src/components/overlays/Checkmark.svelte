<script lang="ts">
  // props
  export let position: string = "right";
</script>

<style>
  .right {
    @apply right-0 mr-6;
  }

  .left {
    @apply left-0 pl-6;
  }
</style>
<span
  class="text-red-500 group-hover:text-white absolute inset-y-0 flex items-center"
  class:right={position === "right"}
  class:left={position === "left"}>
  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fill-rule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0
      011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clip-rule="evenodd" />
  </svg>
</span>
