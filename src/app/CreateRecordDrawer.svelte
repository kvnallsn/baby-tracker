<script lang="ts">
  // imports
  import { createEventDispatcher, onMount } from "svelte";
  import Flatpickr from "svelte-flatpickr";
  import { state, DiaperCondition } from "../stores.ts";
  import Drawer from "../components/Drawer.svelte";
  import Select from "../components/Select.svelte";
  import RadioGroup from "../components/RadioGroup.svelte";
  import Text from "../components/input/Text.svelte";
  import TextArea from "../components/input/TextArea.svelte";

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
    { value: DiaperCondition.Dry, text: "Dry" },
    { value: DiaperCondition.Wet, text: "Wet" },
    { value: DiaperCondition.Bowel, text: "BM" },
  ];

  let diaperLeakages = [
    { value: "no", text: "No Leakage" },
    { value: "yes", text: "Leakage" },
  ];

  let nursingSides = [
    { value: "left", text: "Left" },
    { value: "right", text: "Right" },
    { value: "both", text: "Both" },
  ];

  let flatpickrOptions = {
    dateFormat: "M d, Y @ h:i K",
    enableTime: true,
    minuteIncrement: 1,
  };

  // mutable data
  let category = categories[0];
  let date = null;

  // diaper mutable data
  let diaperCondition = diaperConditions[0];
  let diaperLeakage = diaperLeakages[0];

  // nursing mutable data
  let nursingSide = nursingSides[0];

  function createRecordSuccess() {
    console.log(category);
    console.log(date);

    switch (+category.id) {
      case Category.Diaper:
        console.log(diaperCondition);
        state.addDiaperEvent({
          datetime: date,
          condition: diaperCondition.value,
        });
        break;

      case Category.Nursing:
        console.log(nursingSide);
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

      <!-- add: brand, size, leakage, notes -->
      <Text id="brand" label="Brand" placeholder="Huggies, Pampers, etc." />

      <RadioGroup
        label="Leakage"
        group="diaperleakage"
        options={diaperLeakages}
        bind:value={diaperLeakage} />
    {:else if category.id == Category.Nursing}
      <RadioGroup
        label="Side"
        group="nursingside"
        options={nursingSides}
        bind:value={nursingSide} />
    {:else if category.id == Category.Sleep}
      <div class="text-base sm:text-sm">
        Little one fell asleep at {date.toLocaleTimeString('en-US')}
      </div>
    {:else if category.id == Category.Awake}
      <div class="text-base sm:text-sm">
        Little one woke up at {date.toLocaleTimeString('en-US')}
      </div>
    {/if}

    <TextArea id="notes" label="Notes" placeholder="..." />
  </div>

</Drawer>
