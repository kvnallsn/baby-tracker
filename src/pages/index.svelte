<script lang="ts">
  // npm imports
  import { onMount, getContext, tick } from "svelte";
  import { writable, derived } from "svelte/store";
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
  import FormDiaperEvent from "~/modals/drawers/CreateDiaperEvent.svelte";
  import FormNursingEvent from "~/modals/drawers/CreateNursingEvent.svelte";
  import FormSleepEvent from "~/modals/drawers/CreateSleepEvent.svelte";
  import FormWakeUpEvent from "~/modals/drawers/CreateWakeUpEvent.svelte";

  import History from "~/components/History.svelte";
  import LatestEvents from "~/components/LatestEvents.svelte";

  // import api
  import * as api from "~/api.ts";
  import { EventType, Event } from "~/api/event.ts";

  // state imports
  import { state, date } from "~/stores.ts";
  import { toastKey } from "~/context.ts";

  // constant data
  const { addToast } = getContext(toastKey);

  // stores
  let history = writable(new Map());
  let latestIds = writable({
    diaper: undefined,
    nursing: undefined,
    sleep: undefined,
  });
  let events = derived(history, $history => [...$history.values()]);
  let latest = derived([history, latestIds], ([$history, $latestIds]) => {
    return {
      diaper: $history.get($latestIds.diaper),
      nursing: $history.get($latestIds.nursing),
      sleep: $history.get($latestIds.sleep),
    };
  });

  /*
  $: latest = {
    diaper: $history[$latestIds.diaper],
    nursing: $history[$latestIds.nursing],
    sleep: $history[$latestIds.sleep],
  };
  */

  // mutable data
  let createDiaperOpen: boolean = false;
  let createNursingOpen: boolean = false;
  let createSleepOpen: boolean = false;
  let createWakeUpOpen: boolean = false;

  /**
   * Loads the latest events from each of the categories
   * and stores them in the history map.
   */
  async function refreshLatest() {
    const data = await api.getLatestEvents($state.babyId);
    history.update(h => {
      h.set(data.diaper.id, data.diaper);
      h.set(data.nursing.id, data.nursing);
      h.set(data.sleep.id, data.sleep);
      return h;
    });

    latestIds.set({
      diaper: data.diaper.id,
      nursing: data.nursing.id,
      sleep: data.sleep.id,
    });
  }

  /**
   * Refreshes the history of events for a baby.
   *
   * Reaches out to the server to get the most recent events stores
   * them in the history map (key: event id)
   */
  async function refreshHistory() {
    const data = await api.getEvents({ baby: $state.babyId });
    history.update(h => {
      for (let i = 0; i < data.length; i++) {
        h.set(data[i].id, data[i]);
      }
      return h;
    });
  }

  /**
   * Adds a new event to the history map
   *
   * @param event [Event] - New event to add
   */
  async function addEventToHistory(event: any) {
      addToast('Successfully added event', { timeout: 2500 });
      history.update(h => {
        h.set(event.detail.id, event.detail);
        return h;
      });

      // if this event is later than the most latest we have, update
      // the latest information
      if (event.detail.event.type === 'diaper') {
        if ($latest.diaper === undefined || event.detail.at > $latest.diaper.at) {
          latestIds.update(ids => {
            ids.diaper = event.detail.id;
            return ids;
          });
        }
      } else if (event.detail.event.type === 'nursing') {
        if ($latest.nursing === undefined || event.detail.at > $latest.nursing.at) {
          latestIds.update(ids => {
            ids.nursing = event.detail.id;
            return ids;
          });
        }
      } else if (event.detail.event.type === 'sleep') {
        if ($latest.sleep === undefined || event.detail.at > $latest.sleep.at) {
          latestIds.update(ids => {
            ids.sleep= event.detail.id;
            return ids;
          });
        }
      } else {
        console.log(`unknown event type: ${event.detail.event.type}`);
      }
  }

  onMount(async() => {
    await Promise.all([refreshHistory(), refreshLatest()]);
  });
</script>

<style>
</style>

<div class="border-b w-full shadow-md sticky top-0 bg-white z-10">
  <div class="max-w-6xl w-full mx-auto">
    <div class="lg:flex lg:items-center lg:justify-between pt-2 pb-4">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
          Lil' Pooper
        </h2>
        <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap">
          <div class="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mr-6">
            <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
            </svg>
            October 15, 2020
          </div>

          <div class="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mr-6">
            <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
            10 lbs 9 oz
          </div>
        </div>
      </div>
      <div class="mt-5 flex lg:mt-0 lg:ml-4">
        <span class="sm:ml-3 shadow-sm rounded-md">
          <Dropdown text="New Event">
            <DropdownButton text="Diaper Change" on:click="{() => createDiaperOpen = true}" />
            <DropdownButton text="Nursing" on:click="{() => createNursingOpen = true}" />
            <DropdownButton text="Sleep" on:click="{() => createSleepOpen = true}" />
            <DropdownButton text="Woke Up" on:click="{() => createWakeUpOpen = true}" />
          </Dropdown>
        </span>
      </div>
    </div>
  </div>
</div>
<div class="max-w-6xl w-full mx-auto">
  <div class="py-12">
    {#if $latestIds.length == 0}
      <div class="grid w-full bg-gray-50 shadow-inner" style="place-items: center; height: 278px">
        <Spinner
          size="100"
          speed="1000"
          color="#C53030"
          thickness="2"
          gap="50"
          />
      </div>
    {:else}
      <LatestEvents data={$latest} />
    {/if}
  </div>
  <div class="flex justify-between items-center">
    <span class="text-xl leading-5 text-gray-900 sm:text-2xl sm:leading-7 sm:truncate p-2">
      History
    </span>
    <div>
      <Button text="Refresh" on:click={refreshHistory} />
    </div>
  </div>
  {#if $history.length == 0}
    <div class="grid w-full bg-gray-50 shadow-inner" style="place-items: center; height: 278px">
      <Spinner
        size="100"
        speed="1000"
        color="#C53030"
        thickness="2"
        gap="50"
        />
    </div>
  {:else}
    <History data={$events} />
    <!--
    <div class="grid w-full bg-gray-50 shadow-inner" style="place-items: center; height: 278px">
      <div class="text-center">
        <div class="text-3xl text-red-600 font-bold">Error Loading History</div>
        <div class="text-xl font-normal mt-4">Please try again in a couple of minutes</div>
      </div>
      </div>
    -->
  {/if}
</div>
<FormDiaperEvent
  open={createDiaperOpen}
  on:success={addEventToHistory}
  on:failed={error => console.error(error)}
  on:close={() => createDiaperOpen = false} />

<FormNursingEvent
  open={createNursingOpen}
  on:success={addEventToHistory}
  on:close="{() => createNursingOpen = false}" />

<FormSleepEvent
  open={createSleepOpen}
  on:success={addEventToHistory}
  on:close="{() => createSleepOpen = false}" />

<FormWakeUpEvent
  open={createWakeUpOpen}
  on:close="{() => createWakeUpOpen = false}" />

<!--
  attribution
  Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
-->
