<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import * as yup from "yup";

  // state imports
  import { state } from "../stores.ts";
  import * as Diaper from "../stores/diaper.ts";

  // component imports
  import RadioGroup from "../components/RadioGroup.svelte";
  import Text from "../components/input/Text.svelte";
  import Number from "../components/input/Number.svelte";

  // props
  export let condition;
  export let brand;
  export let size;
  export let leakage;

  // constants
  const dispatch = createEventDispatcher();

  let conditions = [
    { value: Diaper.Condition.Dry, text: "Dry" },
    { value: Diaper.Condition.Wet, text: "Wet" },
    { value: Diaper.Condition.Bowel, text: "BM" },
  ];

  let leakages = [
    { value: Diaper.Leakage.No, text: "No Leakage" },
    { value: Diaper.Leakage.Yes, text: "Leakage" },
    { value: Diaper.Leakage.Blowout, text: "Blowout" },
  ];

  let sizeSchema = yup.number().min(0).max(7).required();
</script>

<style>
</style>

<RadioGroup
  label="Condition"
  options={diaperConditions}
  bind:value={diaperCondition} />

<Text id="brand" label="Brand" placeholder="Huggies, Pampers, etc." bind:value={diaperBrand} />

<Number id="size" label="Size" placeholder="Diaper size (0, 1, 2, etc)" bind:value={diaperSize} />

<RadioGroup
  label="Leakage"
  options={diaperLeakages}
  bind:value={diaperLeakage} />
