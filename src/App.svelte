<script lang="ts">
  import GlobalStyle from "~/GlobalStyle.svelte";

  import { Router } from "@sveltech/routify";
  import { routes } from "@sveltech/routify/tmp/routes";
</script>

<style>
  .layout {
    display: grid;
    grid-template-rows: auto 1fr;
  }
</style>

<GlobalStyle />
<Router {routes} />

<!--
  attribution
  Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
-->
