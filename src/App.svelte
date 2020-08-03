<script lang="ts">
  // npm imports
  import { onMount } from "svelte";
  import Spinner from "svelte-spinner";

  // page-specific imports
  import CreateRecordDrawer from "./app/CreateRecordDrawer.svelte";
  import GlobalStyle from "./GlobalStyle.svelte";

  // component imports
  import Navbar from "./components/Navbar.svelte";
  import Button from "./components/Button.svelte";

  // import api
  import * as api from "./api.ts";

  // state imports
  import { state } from "./stores.ts";

  // svg imports
  import bottle from "./svg/004-feeding bottle.svg";

  // mutable data
  let alertVisible: boolean = false;
  let drawerVisible: boolean = false;

  console.log(bottle);

  function showCreateRecord() {
    state.now();
    drawerVisible = true;
  }

  async function refresh() {
    console.log("refresh");
    await state.refreshEvents("291aa286-0637-4b0d-808c-8ded73da58b7");
  }

  // get most recent sleep record to see if baby is sleeping
  //$: sleeping = (!$state.sleep[0].wokeup && ((new Date()).getTime() > $state.sleep[0].datetime.getTime()));

  onMount(async () => {
    await state.refreshEvents("291aa286-0637-4b0d-808c-8ded73da58b7");
  });
</script>

<style>
  .layout {
    display: grid;
    grid-template-rows: auto 1fr;
  }

  .header {
    @apply px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider;
  }

  .cell {
    @apply px-6 py-4 whitespace-no-wrap border-b border-gray-200;
  }
</style>

<GlobalStyle />
<div class="layout h-screen w-screen">
  <Navbar on:showCreateRecord={showCreateRecord} />
  <div class="max-w-6xl w-full mx-auto">
    {#if $state.events.refreshing}
      <div class="grid h-full w-full" style="place-items: center">
        <Spinner
          size="100"
          speed="1000"
          color="#C53030"
          thickness="2"
          gap="50"
        />
      </div>
    {:else}
      <div class="flex justify-between items-center">
        <span class="text-3xl p-2">Diapers</span>
        <Button text="Refresh" on:click={refresh} />
      </div>
      <hr class="my-1" />
      <div class="flex flex-col">
        <img class="h-8 w-8" src={bottle} alt="bottle" />
      </div>
    {/if}
  </div>
</div>
<div>
  <CreateRecordDrawer
    open={drawerVisible}
    on:close={(_e) => (drawerVisible = false)} />
</div>

<!--
  attribution
  Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
-->
