<script lang="ts">
  // npm imports
  import { createEventDispatcher, onMount } from "svelte";
  import * as yup from "yup";

  // state imports
  import { state, date } from "../stores.ts";

  // Models
  import * as Diaper from "../api/diaper.ts";
  import * as Nursing from "../api/nursing.ts";
  import * as Sleep from "../api/sleep.ts";

  // Forms

  // component imports
  import Drawer from "../components/Drawer.svelte";
  import Select from "../components/Select.svelte";
  import RadioGroup from "../components/RadioGroup.svelte";
  import Text from "../components/input/Text.svelte";
  import TextArea from "../components/input/TextArea.svelte";
  import Number from "../components/input/Number.svelte";
  import DatePicker from "../components/DatePicker.svelte";

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
    { value: Diaper.Leakage.None, text: "No Leakage" },
    { value: Diaper.Leakage.Some, text: "Leakage" },
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

  // reactive data

  // mutable data
  let category;
  let notes;
  let errors;

  // diaper mutable data
  let diaperCondition;
  let diaperBrand;
  let diaperSize;
  let diaperLeakage;

  // nursing mutable data
  let nursingSource;
  let nursingSide;

  // schemas
  let diaperSizeSchema = yup.number().min(0).max(7).required();

  function resetMutableData() {
    date.set(new Date());

    errors = [];
    category = Category.Diaper;
    notes = "";

    // diaper mutable data
    diaperCondition = Diaper.Condition.Dry;
    diaperBrand = "";
    diaperSize = 0;
    diaperLeakage = Diaper.Leakage.None;

    // nursing mutable data
    nursingSource = Nursing.Source.Breast;
    nursingSide = undefined;
  }

  async function createRecordSuccess() {
    try {
      let event;

      switch (+category) {
        case Category.Diaper: {
          event = {
            type: "diaper",
            condition: diaperCondition,
            brand: diaperBrand,
            size: diaperSize,
            leakage: diaperLeakage,
          };
          break;
        }

        case Category.Nursing: {
          event = {
            type: "nursing",
            source: nursingSource,
            detail: nursingSide,
          };

          break;
        }

        case Category.Sleep: {
          event = {
            type: "sleep",
            wokeup: undefined,
          };

          break;
        }

        case Category.Awake:
          break;

        default:
          break;
      }

      if (event !== undefined) {
        const payload = {
          baby_id: "dceae182-1561-4486-9f6a-fe7fa8dae491",
          at: $date.toISOString(),
          notes: notes,
          event: event,
        };

        await state.createEvent(payload);
      }
    } catch (e) {
      console.error(e);
    } finally {
      resetMutableData();
      dispatch("close");
    }
  }

  function createRecordCancelled() {
    dispatch("close");
  }

  onMount(async () => {
    resetMutableData();
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
    {#if errors.length > 0}
      <div class="h-24 flex space-y-2 w-full bg-red-900">
        {#each errors as error}
          <span class="text-sm">{error}</span>
        {/each}
      </div>
    {/if}
    <div>
      <DatePicker bind:value={$date} />
    </div>
    <Select
      title="Category"
      options={categories}
      on:selected={(e) => (category = e.detail.id)} />

    {#if category == Category.Diaper}
      <RadioGroup
        label="Condition"
        options={diaperConditions}
        bind:value={diaperCondition} />

      <Text
        id="brand"
        label="Brand"
        placeholder="Huggies, Pampers, etc."
        bind:value={diaperBrand} />

      <Number
        id="size"
        label="Size"
        placeholder="Diaper size (0, 1, 2, etc)"
        schema={diaperSizeSchema}
        bind:value={diaperSize} />

      <RadioGroup
        label="Leakage"
        options={diaperLeakages}
        bind:value={diaperLeakage} />
    {:else if category == Category.Nursing}
      <RadioGroup
        label="Source"
        options={nursingSources}
        bind:value={nursingSource} />

      {#if nursingSource === Nursing.Source.Breast}
        <RadioGroup
          label="Side"
          options={nursingBreastSides}
          bind:value={nursingSide} />
      {:else}
        <RadioGroup
          label="Contents"
          options={nursingBottleTypes}
          bind:value={nursingSide} />
      {/if}
    {:else if category == Category.Sleep}
      <div class="text-base sm:text-sm">
        Little one fell asleep at {$date.toLocaleTimeString('en-US')}
      </div>
    {:else if category == Category.Awake}
      <div class="text-base sm:text-sm">
        Little one woke up at {$date.toLocaleTimeString('en-US')}
      </div>
    {/if}

    <TextArea id="notes" label="Notes" placeholder="..." bind:value={notes} />
  </div>

</Drawer>
