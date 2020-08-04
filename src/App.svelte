<script lang="ts">
  // npm imports
  import { onMount } from "svelte";
  import Spinner from "svelte-spinner";
  import SvelteInfiniteScroll from "svelte-infinite-scroll";

  // page-specific imports
  import CreateRecordDrawer from "./app/CreateRecordDrawer.svelte";
  import GlobalStyle from "./GlobalStyle.svelte";

  // component imports
  import Navbar from "./components/Navbar.svelte";
  import Button from "./components/Button.svelte";

  // import api
  import * as api from "./api.ts";
  import { EventType } from "./api/event.ts";

  // state imports
  import { state } from "./stores.ts";

  // svg imports
  import diaper from "./svg/010-diaper.svg";
  import bottle from "./svg/004-feeding bottle.svg";
  import night from "./svg/026-night.svg";

  // mutable data
  let alertVisible: boolean = false;
  let drawerVisible: boolean = false;
  let page = 0;

  function showCreateRecord() {
    state.now();
    drawerVisible = true;
  }

  async function refresh() {
    console.log("refresh");
    await state.refreshEvents("dceae182-1561-4486-9f6a-fe7fa8dae491");
  }

  async function loadNextPage() {
    page += 1;
    await state.loadMoreEvents("dceae182-1561-4486-9f6a-fe7fa8dae491", page);
  }

  onMount(async () => {
    await state.refreshEvents("dceae182-1561-4486-9f6a-fe7fa8dae491");
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

  .cell-title {
    @apply text-sm leading-5 text-gray-900;
  }

  .cell-subtitle {
    @apply text-sm leading-5 text-gray-500;
  }

  .group:hover .cell-title {
    @apply text-white;
  }

  .group:hover .cell-subtitle {
    @apply text-gray-200;
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
        <span class="text-3xl p-2">Events</span>
        <Button text="Refresh" on:click={refresh} />
      </div>
      <hr class="my-1" />
      <div class="flex flex-col">
        <div class="-my-2 py-2 overflow-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div class="align-middle inline-block min-w-full shadow sm:rounded-lg border-b border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <tbody>
                {#each $state.events.data as event}
                  <tr class="group hover:bg-red-600">
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 group-hover:text-white">
                          {#if event.event.type === EventType.Diaper}
                            <img class="h-10 w-10 rounded-full" src={diaper} alt="diaper" />
                          {:else if event.event.type === EventType.Nursing}
                            <img class="h-10 w-10 rounded-full" src={bottle} alt="bottle" />
                          {:else if event.event.type === EventType.Sleep}
                            <img class="h-10 w-10 rounded-full" src={night} alt="sleep" />
                          {/if}
                        </div>
                        <div class="ml-4">
                          <div class="cell-title">
                            {#if event.event.type === EventType.Diaper}
                              Diaper Change
                            {:else if event.event.type === EventType.Nursing}
                              Nursing
                            {:else if event.event.type === EventType.Sleep}
                              Sleep
                            {/if}
                          </div>
                          <div class="cell-subtitle">
                            {event.at.toLocaleString('en-US')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {#if event.event.type === EventType.Diaper}
                        <div class="cell-title">{event.event.detail.status()}</div>
                        <div class="cell-subtitle">{event.event.detail.state()}</div>
                      {:else if event.event.type === EventType.Nursing}
                        <div class="cell-title">{event.event.detail.get_source()}</div>
                        <div class="cell-subtitle">Source</div>
                      {:else if event.event.type === EventType.Sleep}
                        Sleep
                      {/if}
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {#if event.event.type === EventType.Diaper}
                        {#if event.event.detail.brand === ""}
                          <div class="cell-title">Generic</div>
                        {:else}
                          <div class="cell-title">{event.event.detail.brand}</div>
                        {/if}
                        <div class="cell-subtitle">Size {event.event.detail.size}</div>
                      {:else if event.event.type === EventType.Nursing}
                        <div class="cell-title">{event.event.detail.get_detail()}</div>
                      {:else if event.event.type === EventType.Sleep}
                        Sleep
                      {/if}
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                      <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit</a>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    {/if}
  </div>
  <SvelteInfiniteScroll
    window={true}
    hasMore={$state.events.hasMore}
    on:loadMore={() => loadNextPage()} />
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
