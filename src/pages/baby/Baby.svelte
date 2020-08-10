<script lang="ts">
  // npm imports
  import { onMount } from "svelte";
  import Spinner from "svelte-spinner";
  import SvelteInfiniteScroll from "svelte-infinite-scroll";

  // action imports
  /*import { portal } from "~/actions/portal.js";*/

  // component imports
  import Button from "~/components/Button.svelte";
  import Card from "~/components/Card.svelte";
  import Dropdown from "~/components/Dropdown.svelte";
  import DropdownButton from "~/components/DropdownButton.svelte";

  // page-specific imports
  import FormDiaperEvent from "./CreateDiaperEvent.svelte";
  import EventsList from "./EventsList.svelte";
  import Latest from "./Latest.svelte";

  // import api
  import * as api from "~/api.ts";
  import { EventType } from "~/api/event.ts";

  // state imports
  import { state, date } from "~/stores.ts";

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

  function showCreateRecord() {
    date.set(new Date());
    drawerVisible = true;
  }

  const BABY_ID ="dceae182-1561-4486-9f6a-fe7fa8dae491";
  async function refresh() {
    await state.refreshEvents(BABY_ID);
  }

  async function loadNextPage() {
    page += 1;
    await state.loadMoreEvents(BABY_ID, page);
  }

  onMount(async () => {
    await state.refreshEvents(BABY_ID);
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

<div class="max-w-6xl w-full mx-auto">
  <div class="py-4">
    <Latest />
  </div>
  <div class="flex justify-between items-center">
    <span class="text-3xl p-2">History</span>
    <div>
      <Button text="Refresh" on:click={refresh} />
      <Dropdown text="New Event">
        <DropdownButton text="Diaper Change" on:click="{() => drawerVisible = true}" />
        <DropdownButton text="Nursing" on:click="{() => drawerVisible = true}" />
        <DropdownButton text="Sleep" on:click="{() => drawerVisible = true}" />
      </Dropdown>
    </div>
  </div>
  <EventsList />
</div>
<FormDiaperEvent
  open={drawerVisible}
  on:close="{() => drawerVisible = false}" />

<!--
  attribution
  Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
-->
