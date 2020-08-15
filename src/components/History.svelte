<script lang="ts">
  // npm imports
  import { onMount } from "svelte";
  import Spinner from "svelte-spinner";
  import SvelteInfiniteScroll from "svelte-infinite-scroll";
  import { Duration } from "luxon";

  // component imports

  // import api
  import * as api from "~/api.ts";
  import { EventType } from "~/api/event.ts";

  // state imports
  import { state } from "~/stores.ts";

  // svg imports
  import diaper from "~/svg/010-diaper.svg";
  import bottle from "~/svg/004-feeding bottle.svg";
  import night from "~/svg/026-night.svg";

  // constant data
  const locale = 'en-US';

  // mutable data
  let alertVisible: boolean = false;
  let drawerVisible: boolean = false;
  let page = 0;

  async function refresh() {
    console.log("refresh");
    await state.refreshEvents($state.babyId);
  }

  async function loadNextPage() {
    page += 1;
    await state.loadMoreEvents($state.babyId, page);
  }

  onMount(async () => {
    await state.refreshEvents($state.babyId);
  });
</script>

<style>
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

{#if $state.events.refreshing}
  <div class="grid w-full bg-gray-50 shadow-inner" style="place-items: center; height: 278px">
    <Spinner
      size="100"
      speed="1000"
      color="#C53030"
      thickness="2"
      gap="50"
      />
  </div>
  <div class="grid h-full w-full" style="place-items: center">
  </div>
{:else if $state.events.error !== undefined}
  <div class="grid w-full bg-gray-50 shadow-inner" style="place-items: center; height: 278px">
    <div class="text-center">
      <div class="text-3xl text-red-600 font-bold">Error Loading History</div>
      <div class="text-xl font-normal mt-4">Please try again in a couple of minutes</div>
    </div>
  </div>
{:else}
  <hr class="my-1" />
  <div class="flex flex-col overflow-y-scroll overflow-x-hidden">
    <div class="-my-2 py-2 overflow-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div class="align-middle inline-block min-w-full shadow sm:rounded-lg border-b border-gray-200">
        <div class="divide-y-8 sm:divide-y divide-gray-100">
          {#each $state.events.data as event}
            <div class="group grid grid-cols-4 md:grid-cols-8 hover:bg-primary-600">
              <div class="col-span-4 sm:col-span-3 px-6 py-4 whitespace-no-wrap border-b border-gray-200">
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
              </div>
              <div class="col-span-2 px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {#if event.event.type === EventType.Diaper}
                  <div class="cell-title">{event.event.detail.get_condition()}</div>
                  <div class="cell-subtitle">{event.event.detail.get_leakage()}</div>
                {:else if event.event.type === EventType.Nursing}
                  <div class="cell-title">{event.event.detail.get_source()}</div>
                  <div class="cell-subtitle">{event.event.detail.get_detail()}</div>
                {:else if event.event.type === EventType.Sleep}
                  {#if event.event.detail.woke_up}
                    <div class="cell-title">
                      {event.event.detail.woke_up.toLocaleString($state.locale)}
                    </div>
                    <div class="cell-subtitle">
                      Woke up
                    </div>
                  {/if}
                {/if}
              </div>
              <div class="col-span-2 px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {#if event.event.type === EventType.Diaper}
                  {#if event.event.detail.brand === ""}
                    <div class="cell-title">Generic</div>
                  {:else}
                    <div class="cell-title">{event.event.detail.brand}</div>
                  {/if}
                  <div class="cell-subtitle">Size {event.event.detail.size}</div>
                {:else if event.event.type === EventType.Nursing}
                  <div class="cell-title" />
                {:else if event.event.type === EventType.Sleep}
                  {#if event.event.detail.woke_up}
                    <div class="cell-title">
                      {Duration.fromMillis(event.event.detail.woke_up.getTime() - event.at.getTime()).as('hours')}
                    </div>
                    <div class="cell-subtitle">Duration</div>
                  {/if}
                {/if}
              </div>
              <div class="hidden sm:block col-span-1 px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit</a>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

{#if $state.events.loadingMore}
  <div class="grid h-full w-full" style="place-items: center">
    <Spinner
      size="100"
      speed="1000"
      color="#C53030"
      thickness="2"
      gap="50"
      />
  </div>
{/if}
<!--
<SvelteInfiniteScroll
window={true}
hasMore={$state.events.hasMore}
on:loadMore={() => loadNextPage()} />
-->

<!--
  attribution
  Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
-->
