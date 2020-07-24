<script lang="ts">
  // imports
  import { createEventDispatcher, onMount } from "svelte";
  import Flatpickr from "svelte-flatpickr";
  import Drawer from "./components/Drawer.svelte";
  import Select from "./components/Select.svelte";
  import RadioGroup from "./components/RadioGroup.svelte";

  // css imports
  import "flatpickr/dist/flatpickr.css";
  import "flatpickr/dist/themes/material_red.css";

  // props
  export let open: boolean = false;

  const dispatch = createEventDispatcher();

  // data
  const categories = [
    { id: 0, title: "Diaper Change" },
    { id: 1, title: "Nursing" },
    { id: 3, title: "Sleep" },
  ];

  let diaperConditions = [
    { value: "dry", text: "Dry" },
    { value: "wet", text: "Wet" },
    { value: "poop", text: "BM" },
  ];

  let flatpickrOptions = {
    dateFormat: "M d, Y @ h:i K",
    enableTime: true,
    minuteIncrement: 1
  };

  // mutable data
  let category = categories[0];
  let date = null;

  // diaper mutable data
  let diaperCondition = diaperConditions[0];

  function createRecordSuccess() {
    console.log(category);
    console.log(date);
    console.log(diaperCondition);
    //dispatch("close");
  }

  function createRecordCancelled() {
    dispatch("close");
  }

  onMount(async () => {
    date = new Date(Date.now());
  });
</script>

<style>

</style>

<Drawer
  {open}
  on:close={(_e) => dispatch('close')}
  on:success={createRecordSuccess}
  on:cancel={createRecordCancelled}
  title="New Record"
  subtitle="What did little do?">

  <div class="h-full flex flex-col space-y-6 bg-white overflow-y-scroll">
    <div>
      <span class="block text-sm leading-5 font-medium text-gray-700">
        Date and Time
      </span>
      <div class="border border-gray-200 p-2 rounded">
        <Flatpickr options={flatpickrOptions} bind:value={date} />
      </div>
    </div>
    <Select
      title="Category"
      options={categories}
      on:selected={(e) => (category = e.detail)} />

    <div>
      {#if category.id == 0}
        <RadioGroup
          label="Condition"
          group="diaperstatus"
          options={diaperConditions}
          bind:value={diaperCondition} />
      {:else if category.id == 1}
        Nursing
      {:else if category.id == 2}
        Tummy
      {:else if category.id == 3}Sleep{:else}Unknown{/if}
    </div>
  </div>

</Drawer>
