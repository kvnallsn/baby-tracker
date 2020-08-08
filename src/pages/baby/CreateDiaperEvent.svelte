<script lang="ts">
  // npm imports
  import { createEventDispatcher, onMount } from "svelte";
  import { createForm } from "svelte-forms-lib";
  import * as yup from "yup";

  // state imports
  import { state, date } from "~/stores.ts";

  // Models
  import * as Diaper from "~/api/diaper.ts";

  // Forms

  // component imports
  import DatePicker from "~/components/DatePicker.svelte";
  import Drawer from "~/components/Drawer.svelte";
  import Number from "~/components/input/Number.svelte";
  import RadioGroup from "~/components/RadioGroup.svelte";
  import Text from "~/components/input/Text.svelte";
  import TextArea from "~/components/input/TextArea.svelte";

  // props
  export let open: boolean = false;

  const dispatch = createEventDispatcher();

  // data
  let conditions = [
    { value: Diaper.Condition.Dry, text: "Dry" },
    { value: Diaper.Condition.Wet, text: "Wet" },
    { value: Diaper.Condition.Bowel, text: "BM" },
  ];

  let leakages = [
    { value: Diaper.Leakage.None, text: "No Leakage" },
    { value: Diaper.Leakage.Some, text: "Leakage" },
    { value: Diaper.Leakage.Blowout, text: "Blowout" },
  ];

  // reactive data

  // mutable data
  const {
    // observable state
    form,
    errors,
    touched,
    isValid,
    isSubmitting,
    isValidating,
    // handlers,
    handleBlur,
    handleChange,
    handleSubmit
  } = createForm({
    initialValues: {
      at: new Date(),
      condition: Diaper.Condition.Dry,
      leakage: Diaper.Leakage.None,
      brand: "",
      size: 0,
      notes: "",
    },

    validationSchema: yup.object().shape({
      at: yup.date().required(),
      condition: yup.mixed().oneOf(['dry', 'wet', 'bowel']).required(),
      leakage: yup.mixed().oneOf(['none', 'some', 'blowout']).required(),
      brand: yup.string(),
      size: yup.number().min(0).max(7).required(),
      notes: yup.string(),
    }),

    onSubmit: values => {
      const payload = {
        baby_id: $state.babyId,
        at: values.at,
        notes: values.notes,
        event: {
          type: "diaper",
          condition: values.condition,
          leakage: values.leakage,
          brand: values.brand,
          size: values.size,
        }
      };

      state.createEvent(payload)
        .then(() => dispatch('close'))
        .catch(e => console.error(e));
    }
  });

  function createRecordCancelled() {
    dispatch("close");
  }
</script>

<style>

</style>
<!-- on:change="{e => form.update(s => { s.at = e.detail.date; return s }) }" -->

<form on:submit={handleSubmit}>
  <Drawer
    {open}
    action="submit"
    on:close={(_e) => dispatch('close')}
    on:cancel={createRecordCancelled}
    title="New Diaper Change"
    subtitle="Please enter details below">

    <div class="h-full flex flex-col space-y-6 bg-white overflow-y-scroll">
      <div>
        <DatePicker
          name="at"
          on:change="{e => $form.at = e.detail.date}"
          bind:value={$date} />
      </div>

      <RadioGroup
        name="condition"
        label="Condition"
        options={conditions}
        bind:value={$form.condition} />

      <RadioGroup
        name="leakage"
        label="Leakage"
        options={leakages}
        bind:value={$form.leakage} />

      <Text
        name="brand"
        label="Brand"
        placeholder="Huggies, Pampers, etc."
        bind:value={$form.brand} />

        <Number
          name="size"
          label="Size"
          placeholder="Diaper size (0, 1, 2, etc)"
          valid={$errors.size.length === 0}
          on:change={handleChange}
          bind:value={$form.size}>
          <div slot="errors">
            {#if $errors.size && $touched.size}
              {$errors.size}
            {/if}
          </div>
        </Number>

      <TextArea
        name="notes"
        label="Notes"
        placeholder="Optional"
        bind:value={$form.notes} />

    </div>
  </Drawer>
</form>
