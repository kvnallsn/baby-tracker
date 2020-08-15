<script lang="ts">
  // component imports
  import Navbar from "~/components/Navbar.svelte";
</script>

<div class="layout h-screen w-screen">
  <Navbar />
  <slot />
</div>
