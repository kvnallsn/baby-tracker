<!-- component -->
<script lang="ts">
  // npm imports
  import { onMount, tick, createEventDispatcher } from 'svelte';

  // component imports
  import Button from "./Button.svelte";
  import TwoItemToggle from "./TwoItemToggle.svelte";

  // imports
  import { clickAway } from '../actions/clickAway.ts';

  // props
  export let name: string | undefined = undefined;
  export let value: Date = new Date();
  export let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  export let locale: string = 'en-US';

  // constants
  const dispatch = createEventDispatcher();
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // mutable data
  let date = new Date();

  // reactive properties
  // synced to the displayed month
  $: year = date.getFullYear();
  $: month = date.getMonth();
  $: day = date.getDate();          // getDate() returns day of month, getDay() returns day of week

  // reactive properties
  // synced to the selected date / time
  $: hour = value.getHours();
  $: minute = value.getMinutes();
  $: display = `${value.toLocaleDateString(locale)} @ ${value.toLocaleTimeString(locale)}`;

  let visible = false;  // True to show datepicker, false to hide
  let tod = 'AM';       // Time of Day (AM / PM)
  let days = 0;         // Number of days in the currently displayed month
  let offset = 0;       // Number of days to skip before the month starts
  let padding = 0;      // Number of days to pad at the end of the month to reach a full row

  function toggleVisible() {
    visible = !visible;
  }

  function areEqual(l: Date, r: Date): boolean {
    // for some reason directly returning this does not work but
    // storing it in a temporary value does? Damn Javascript
    const t =
      (l.getFullYear() == r.getFullYear()) &&
      (l.getMonth() == r.getMonth()) &&
      (l.getDate() == r.getDate());

    return t;
  }

  function isToday(day: number): boolean {
    return areEqual(new Date(), new Date(year, month, day));
  }

  async function getDateValue(d) {
    value = new Date(year, month, d, hour, minute);
    await tick();
    dispatch('change', { date: value });
  }

  function getNoOfDays() {
    // Day 0 is the last day in the previous month
    let lastDay = month == 11 ? new Date(year + 1, 0, 0) : new Date(year, month + 1, 0);

    // get the date (1 - N)
    days = lastDay.getDate();

    // getDay() returns 0 - 6, where 0 is Sunday and 6 is Saturday
    // find where to start calendar day of week
    offset = new Date(year, month).getDay();

    // find how many days to pad at the end
    // NOTE: we use 6, not 7 because `getDay()` is zero-based
    padding = 6 - lastDay.getDay();
  }

  async function prevMonth() {
    if (month == 0) {
      date = new Date(year - 1, 11, day, hour, minute);
    } else {
      date = new Date(year, month - 1, day, hour, minute);
    }

    await tick();

    getNoOfDays();
  }

  async function nextMonth() {
    if (month == 11) {
      date = new Date(year + 1, 0, day, hour, minute);
    } else {
      date = new Date(year, month + 1, day, hour, minute);
    }

    await tick();

    getNoOfDays();
  }

  function offsetHour(diff: number) {
    const h = hour + diff;
    if ((hour == 11 && h == 12) || (h < 0)) {
      tod = 'PM';
    } else if ((hour == 12 && h == 11) || (h > 23)) {
      tod = 'AM';
    }

    if (h < 0) {
      value = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 23, minute);
    } else if (h > 23) {
      value = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, minute);
    } else {
      value = new Date(value.getFullYear(), value.getMonth(), value.getDate(), h, minute);
    }

    dispatch('change', { date: value });
  }

  function offsetMinute(diff: number) {
    const m = minute + diff;
    if (m < 0) {
      value = new Date(value.getFullYear(), value.getMonth(), value.getDate(), hour, 59);
    } else if (m > 59) {
      value = new Date(value.getFullYear(), value.getMonth(), value.getDate(), hour, 0);
    } else {
      value = new Date(value.getFullYear(), value.getMonth(), value.getDate(), hour, m);
    }

    dispatch('change', { date: value });
  }

  function flipTod(event) {
    if (event.detail.value === 'AM') {
      value = new Date(value.getFullYear(), value.getMonth(), value.getDate(), hour - 12, minute);
    } else if (event.detail.value === 'PM') {
      value = new Date(value.getFullYear(), value.getMonth(), value.getDate(), hour + 12, minute);
    } else {
      console.log('unknown time of day');
    }

    dispatch('change', { date: value });
  }

  function formatMinute(value) {
    if (value.length === 1) {
      value = '0' + value;
    }
  }

  onMount(() => {
    getNoOfDays();
  });
</script>

<style>
  .today {
    @apply border border-primary-500;
  }

  .selected {
    @apply bg-primary-500 text-white;
  }

  .not-today {
    @apply text-gray-700;
  }

  .not-today:hover {
    @apply bg-blue-200;
  }

  .btn-disabled {
    @apply cursor-not-allowed opacity-25;
  }
</style>

<div {name} class="w-full">
  <label for="datepicker" class="block text-sm leading-5 font-medium text-gray-700">
    Select Date
  </label>
  <div class="relative group">
    <input 
      type="text"
      readonly
      value={display}
      on:click={toggleVisible}
      on:keydown="{e => { if (e.key === "Escape") { visible = false }}}"
      class="form-input block w-full pl-2 pr-10 sm:text-sm sm:leading-5 group-hover:bg-primary-700 group-hover:text-white z-20"
      placeholder="Select date">

      <div class="absolute top-0 right-0 px-3 py-2">
        <svg class="h-6 w-6 text-gray-400"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>

      {#if visible}
        <div 
          use:clickAway
          class="w-full bg-white mt-12 rounded-lg shadow border border-primary-700 p-4 absolute top-0 left-0 z-10"
          on:click_away="{() => visible = false}">

          <div class="flex justify-between items-center mb-2">
            <div>
              <span class="text-lg font-bold text-gray-800">{months[month]}</span>
              <span class="ml-1 text-lg text-gray-600 font-normal">{year}</span>
            </div>
            <div>
              <button 
                type="button"
                class="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full" 
                on:click={prevMonth}>
                <svg class="h-6 w-6 text-gray-500 inline-flex"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>  
              </button>
              <button 
                type="button"
                class="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full" 
                on:click={nextMonth}>
                <svg class="h-6 w-6 text-gray-500 inline-flex"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-7">
            {#each DAYS as day}
              <div class="px-1">
                <div class="text-gray-800 font-medium text-center text-xs">{day}</div>
              </div>
            {/each}

            <!-- separator line between days of month (Sun / Mon / Tue / etc.) and calendar -->
            <hr class="col-span-7 my-2" />

            <!-- padding before first day of month -->
            {#each [...Array(offset).keys()] as _}
              <div class="p-1" />
            {/each}

            <!-- the days of each month -->
            {#each [...Array(days).keys()] as d}
              <div class="px-1 mb-1">
                <div
                  on:click={() => getDateValue(d+1)}
                  class="{`cursor-pointer text-center text-sm leading-none rounded-full leading-loose transition ease-in-out duration-100 ${isToday(d + 1) ? 'today' : 'not-today'}`}"
                  class:selected="{areEqual(value, new Date(year, month, d+1))}"
                  >
                  {d + 1}
                </div>
              </div>
            {/each}

            <!-- padding after last day of month to finish grid -->
            {#each [...Array(padding).keys()] as _}
              <div class="p-1" />
            {/each}

            <!-- separator line between date and time picker -->
            <hr class="col-span-7 mt-1 mb-3" />

            <div class="col-span-2 text-center text-sm leading-none">
              <div class="flex flex-row w-full rounded-lg relative items-center h-full">
                <button
                  type="button"
                  class="w-12 text-gray-600 hover:text-gray-700 hover:bg-primary-400 rounded-l cursor-pointed outline-none"
                  on:click="{() => { offsetHour(-1) }}"
                >
                  <span class="m-auto text-2xl font-thin">-</span>
                </button>
                <span class="text-sm leading-none px-4">
                  {#if hour > 12}
                    {hour - 12}
                  {:else if hour == 0}
                    12
                  {:else}
                    {hour}
                  {/if}
                </span>
                <button
                  type="button"
                  class="w-12 text-gray-600 hover:text-gray-700 hover:bg-primary-400 rounded-r cursor-pointed outline-none"
                  on:click="{() => { offsetHour(1) }}"
                >
                  <span class="m-auto text-2xl font-thin">+</span>
                </button>
              </div>
            </div>
            <div class="col-span-1 text-center text-sm leading-none">
              <div class="h-full flex justify-center items-center">:</div>
            </div>
            <div class="col-span-2 text-center text-sm leading-none">
              <div class="flex flex-row w-full rounded-lg relative items-center h-full">
                <button
                  type="button"
                  class="w-12 text-gray-600 hover:text-gray-700 hover:bg-primary-400 rounded-l cursor-pointed outline-none"
                  on:click="{() => { offsetMinute(-1) }}"
                >
                  <span class="m-auto text-2xl font-thin">-</span>
                </button>
                <span class="text-sm leading-none px-4">
                  {#if minute < 10}
                    {'0' + minute}
                  {:else}
                    {minute}
                  {/if}
                </span>
                <button
                  type="button"
                  class="w-12 text-gray-600 hover:text-gray-700 hover:bg-primary-400 rounded-r cursor-pointed outline-none"
                  on:click="{() => { offsetMinute(1) }}"
                >
                  <span class="m-auto text-2xl font-thin">+</span>
                </button>
              </div>
            </div>
            <div class="col-span-2 text-center text-sm leading-none">
              <TwoItemToggle left="AM" right="PM" bind:value={tod} on:click={flipTod} />
            </div>

            <!-- separator line between time and actions-->
            <hr class="col-span-7 mt-3 mb-3" />

            <div class="col-span-3 text-center text-sm leading-none">
              <Button text="Now" on:click="{() => value = new Date() }" full />
            </div>

            <div class="col-span-1 text-center text-sm leading-none">
            </div>

            <div class="col-span-3 text-center text-sm leading-none">
              <Button text="Close" on:click="{() => visible = false}" full />
            </div>
          </div>
        </div>
      {/if}
  </div>
</div>

