<script lang="ts">
  // npm imports
  import { onMount } from "svelte";

  // page-specific imports
  import CreateRecordDrawer from "./app/CreateRecordDrawer.svelte";
  import GlobalStyle from "./GlobalStyle.svelte";

  // component imports
  import Navbar from "./components/Navbar.svelte";

  // state imports
  import { state } from "./stores.ts";

  // mutable data
  let alertVisible: boolean = false;
  let drawerVisible: boolean = false;

  function showCreateRecord() {
    state.now();
    drawerVisible = true;
  }
</script>

<style>
  .header {
    @apply px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider;
  }

  .cell {
    @apply px-6 py-4 whitespace-no-wrap border-b border-gray-200;
  }
</style>

<GlobalStyle />
<Navbar on:showCreateRecord={showCreateRecord} />
<CreateRecordDrawer
  open={drawerVisible}
  on:close={(_e) => (drawerVisible = false)} />
<div class="max-w-6xl w-full mx-auto">
  <span class="text-3xl p-2">Diapers</span>
  <hr class="my-1" />
  <div class="flex flex-col">
    <div class="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div
        class="align-middle inline-block min-w-full shadow overflow-hidden
        sm:rounded-lg border-b border-gray-200">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="header">Date</th>
              <th class="header">Time</th>
              <th class="header">Condition</th>
              <th class="header">Brand</th>
              <th class="header">Size</th>
              <th class="header">Leakage</th>
              <th class="header">Notes</th>
            </tr>
          </thead>
          <tbody>
            {#each $state.diapers as event}
              <tr>
                <td class="cell">
                  {event.datetime.toLocaleDateString('en-US')}
                </td>
                <td class="cell">
                  {event.datetime.toLocaleTimeString('en-US')}
                </td>
                <td class="cell">{event.condition}</td>
                <td class="cell">{event.brand}</td>
                <td class="cell">{event.size}</td>
                <td class="cell">{event.leakage}</td>
                <td class="cell">{event.notes}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="my-4" />

  <span class="text-3xl p-2">Nursing</span>
  <hr class="my-1" />
  <div class="flex flex-col">
    <div class="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div
        class="align-middle inline-block min-w-full shadow overflow-hidden
        sm:rounded-lg border-b border-gray-200">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="header">Date</th>
              <th class="header">Time</th>
              <th class="header">Source</th>
              <th class="header">Side / Contents</th>
              <th class="header">Notes</th>
            </tr>
          </thead>
          <tbody>
            {#each $state.nursing as event}
              <tr>
                <td class="cell">
                  {event.datetime.toLocaleDateString('en-US')}
                </td>
                <td class="cell">
                  {event.datetime.toLocaleTimeString('en-US')}
                </td>
                <td class="cell">{event.source}</td>
                <td class="cell">{event.side}</td>
                <td class="cell">{event.notes}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="my-4" />

  <span class="text-3xl p-2">Sleep</span>
  <hr class="my-1" />
  <div class="flex flex-col">
    <div class="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div
        class="align-middle inline-block min-w-full shadow overflow-hidden
        sm:rounded-lg border-b border-gray-200">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="header">Date Fell Asleep</th>
              <th class="header">Time Fell Asleep</th>
              <th class="header">Date Woke Up</th>
              <th class="header">Time Woke Up</th>
            </tr>
          </thead>
          <tbody>
            {#each $state.sleep as event}
              <tr>
                <td class="cell">
                  {event.datetime.toLocaleDateString('en-US')}
                </td>
                <td class="cell">
                  {event.datetime.toLocaleTimeString('en-US')}
                </td>
                <td class="cell">
                  {#if event.wokeup}
                    {event.wokeup?.toLocaleDateString('en-US')}
                  {:else}
                    <span>-</span>
                  {/if}
                </td>
                <td class="cell">
                  {#if event.wokeup}
                    {event.wokeup?.toLocaleTimeString('en-US')}
                  {:else}
                    <span>-</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
