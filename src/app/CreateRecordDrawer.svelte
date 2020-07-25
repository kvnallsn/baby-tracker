<script lang="ts">
  // npm imports
  import { createEventDispatcher, onMount } from "svelte";
  import Flatpickr from "svelte-flatpickr";

  // state imports
  import { state } from "../stores.ts";
  import * as Diaper from "../stores/diaper.ts";
  import * as Nursing from "../stores/nursing.ts";

  // component imports
  import Drawer from "../components/Drawer.svelte";
  import Select from "../components/Select.svelte";
  import RadioGroup from "../components/RadioGroup.svelte";
  import Text from "../components/input/Text.svelte";
  import TextArea from "../components/input/TextArea.svelte";
  import Number from "../components/input/Number.svelte";

  // props
  export let open: boolean = false;

  const dispatch = createEventDispatcher();

  // data
  enum Category {
    Diaper = 1,
    Nursing,
    Sleep,
    Awake,
  }

  const categories = [
    { id: Category.Diaper, title: "Diaper Change" },
    { id: Category.Nursing, title: "Nursing" },
    { id: Category.Sleep, title: "Sleep" },
    { id: Category.Awake, title: "Awake" },
  ];

  let diaperConditions = [
    { value: Diaper.Condition.Dry, text: "Dry" },
    { value: Diaper.Condition.Wet, text: "Wet" },
    { value: Diaper.Condition.Bowel, text: "BM" },
  ];

  let diaperLeakages = [
    { value: Diaper.Leakage.No, text: "No Leakage" },
    { value: Diaper.Leakage.Yes, text: "Leakage" },
    { value: Diaper.Leakage.Blowout, text: "Blowout" },
  ];

  let nursingSources = [
    { value: Nursing.Source.Breast, text: "Breast" },
    { value: Nursing.Source.Bottle, text: "Bottle" },
  ];

  let nursingBreastSides = [
    { value: Nursing.Side.Left, text: "Left" },
    { value: Nursing.Side.Right, text: "Right" },
    { value: Nursing.Side.Both, text: "Both" },
  ];

  let nursingBottleTypes = [
    { value: Nursing.Side.Formula, text: "Formula" },
    { value: Nursing.Side.Pumped, text: "Pumped" },
  ];

  let flatpickrOptions = {
    dateFormat: "M d, Y @ h:i K",
    enableTime: true,
    minuteIncrement: 1,
  };

  // reactive data
  $: date = $state.date;

  // mutable data
  let category = categories[0];
  let notes = "";

  // diaper mutable data
  let diaperCondition = diaperConditions[0];
  let diaperLeakage = diaperLeakages[0];
  let diaperBrand = "";
  let diaperSize = 0;

  // nursing mutable data
  let nursingSource = nursingSources[0];
  let nursingSide = undefined;

  function createRecordSuccess() {
    switch (+category.id) {
      case Category.Diaper:
        state.addDiaperEvent({
          datetime: date,
          condition: diaperCondition.value,
          brand: diaperBrand,
          size: diaperSize,
          leakage:diaperLeakage.value,
          notes: notes,
        });
        break;

      case Category.Nursing:
        state.addNursingEvent({
          datetime: date,
          source: nursingSource.value,
          side: nursingSide.value,
          notes: notes,
        });
        break;

      case Category.Sleep:
        break;

      case Category.Awake:
        break;

      default:
        break;
    }

    dispatch("close");
  }

  function createRecordCancelled() {
    dispatch("close");
  }
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
      <div
        class="group border border-gray-200 p-2 rounded hover:bg-red-700
        cursor-pointer">
        <Flatpickr
          options={flatpickrOptions}
          bind:value={date}
          class="group-hover:bg-red-700 group-hover:text-white cursor-pointer" />
      </div>
    </div>
    <Select
      title="Category"
      options={categories}
      on:selected={(e) => (category = e.detail)} />

    {#if category.id == Category.Diaper}
      <RadioGroup
        label="Condition"
        group="diaperstatus"
        options={diaperConditions}
        bind:value={diaperCondition} />

      <Text id="brand" label="Brand" placeholder="Huggies, Pampers, etc." bind:value={diaperBrand} />

      <Number id="size" label="Size" placeholder="Diaper size (0, 1, 2, etc)" bind:value={diaperSize} />

      <RadioGroup
        label="Leakage"
        group="diaperleakage"
        options={diaperLeakages}
        bind:value={diaperLeakage} />
    {:else if category.id == Category.Nursing}
      <RadioGroup
        label="Source"
        group="nursingsource"
        options={nursingSources}
        bind:value={nursingSource} />

        {#if nursingSource.value === Nursing.Source.Breast }
          <RadioGroup
            label="Side"
            group="nursingside"
            options={nursingBreastSides}
            bind:value={nursingSide} />
        {:else}
          <RadioGroup
            label="Type"
            group="nursingtype"
            options={nursingBottleTypes}
            bind:value={nursingSide} />
        {/if}
    {:else if category.id == Category.Sleep}
      <div class="text-base sm:text-sm">
        Little one fell asleep at {date.toLocaleTimeString('en-US')}
      </div>
    {:else if category.id == Category.Awake}
      <div class="text-base sm:text-sm">
        Little one woke up at {date.toLocaleTimeString('en-US')}
      </div>
    {/if}

    <TextArea id="notes" label="Notes" placeholder="..." bind:value={notes} />
  </div>

</Drawer>
