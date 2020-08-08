<script lang="ts">
  import GlobalStyle from "~/GlobalStyle.svelte";

  // component imports
  import Navbar from "~/components/Navbar.svelte";

  // pages
  import Baby from "~/pages/baby/Baby.svelte";
</script>

<style>
  .layout {
    display: grid;
    grid-template-rows: auto 1fr;
  }
</style>

<GlobalStyle />
<div class="layout h-screen w-screen">
  <Navbar />
  <Baby />
</div>

<!--
  attribution
  Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
-->
