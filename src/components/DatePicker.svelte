<!-- component -->
<script lang="ts">
  // npm imports
  import { onMount } from 'svelte';

  // imports
  import { clickAway } from '../actions/clickAway.ts';

  // constants
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // mutable data
  let showDatepicker = false;
  let datepickerValue = '';

  let month = '';
  let year = '';

  let days = 0;
  let offset = 0;

  function toggleVisible() {
    showDatepicker = !showDatepicker;
  }

  function initDate() {
    let today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    datepickerValue = new Date(year, month, today.getDate()).toDateString();
  }

  function isToday(day) {
    const today = new Date();
    const d = new Date(year, month, day);

    return today.toDateString() === d.toDateString();
  }

  function getDateValue(date) {
    let selectedDate = new Date(year, month, date);
    datepickerValue = selectedDate.toDateString();
    showDatepicker = false;
  }

  function getNoOfDays() {
    // Day 0 is the last day in the previous month
    days = (month == 11 ? new Date(year + 1, 0, 0) : new Date(year, month + 1, 0)).getDate();

    // find where to start calendar day of week
    offset = new Date(year, month).getDay();
  }

  function prevMonth() {
    if (month == 0) {
      month = 11;
      year -= 1;
    } else {
      month -= 1;
    }

    getNoOfDays();
  }

  function nextMonth() {
    if (month == 11) {
      month = 0;
      year += 1;
    } else {
      month += 1;
    }

    getNoOfDays();
  }

  onMount(() => {
    initDate();
    getNoOfDays();
  });
</script>

<style>
  .today {
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

<div class="w-full">
  <label for="datepicker" class="block text-sm leading-5 font-medium text-gray-700">
    Select Date
  </label>
  <div class="relative group">
    <input 
      type="text"
      readonly
      value={datepickerValue}
      on:click={toggleVisible}
      on:keydown="{e => { if (e.key === "Escape") { showDatepicker = false }}}"
      class="form-input block w-full pl-2 pr-10 sm:text-sm sm:leading-5 group-hover:bg-primary-700 group-hover:text-white z-20"
      placeholder="Select date">

      <div class="absolute top-0 right-0 px-3 py-2">
        <svg class="h-6 w-6 text-gray-400"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>

      {#if showDatepicker}
        <div 
          use:clickAway
          class="w-full bg-white mt-12 rounded-lg shadow border border-primary-700 p-4 absolute top-0 left-0 z-10"
          on:click_away="{_e => showDatepicker = false}">

          <div class="flex justify-between items-center mb-2">
            <div>
              <span class="text-lg font-bold text-gray-800">{MONTH_NAMES[month]}</span>
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

          <div class="flex flex-wrap mb-3 -mx-1">
            {#each DAYS as day, index}
              <div style="width: 14.26%" class="px-1">
                <div class="text-gray-800 font-medium text-center text-xs">{day}</div>
              </div>
            {/each}
          </div>

          <div class="flex flex-wrap -mx-1">
            {#each [...Array(offset).keys()] as _}
              <div 
                style="width: 14.28%"
                class="text-center border p-1 border-transparent text-sm"	
                ></div>
            {/each}
            {#each [...Array(days).keys()] as date}
              <div style="width: 14.28%" class="px-1 mb-1">
                <div
                  on:click={_e => getDateValue(date + 1)}
                  class="cursor-pointer text-center text-sm leading-none rounded-full leading-loose transition ease-in-out duration-100"
                  class:today="{isToday(date + 1)}"
                  class:not-today="{!isToday(date + 1)}">
                  {date + 1}
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
  </div>
</div>

