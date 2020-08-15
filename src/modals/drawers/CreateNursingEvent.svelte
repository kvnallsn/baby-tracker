<script lang="ts">
  // npm imports
  import { createEventDispatcher, onMount } from "svelte";
  import { createForm } from "svelte-forms-lib";
  import * as yup from "yup";

  // state imports
  import { state, date } from "~/stores.ts";

  // Models
  import { Source, SourceDetail } from "~/api/event.ts";

  // Forms

  // component imports
  import DatePicker from "~/components/DatePicker.svelte";
  import Drawer from "~/components/Drawer.svelte";
  import RadioGroup from "~/components/RadioGroup.svelte";
  /*import Text from "~/components/input/Text.svelte";*/
  import TextArea from "~/components/input/TextArea.svelte";

  // props
  export let open: boolean = false;

  const dispatch = createEventDispatcher();

  // data
  let sources = [
    { value: Source.Breast, text: "Breast" },
    { value: Source.Bottle, text: "Bottle" },
  ];

  let breast_details = [
    { value: SourceDetail.Left, text: "Left" },
    { value: SourceDetail.Right, text: "Right" },
    { value: SourceDetail.Both, text: "Both" },
  ];

  let bottle_details = [
    { value: SourceDetail.Pumped, text: "Pumped" },
    { value: SourceDetail.Formula, text: "Formula" },
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
      source: Source.Breast,
      detail: SourceDetail.Left,
      notes: "",
    },

    validationSchema: yup.object().shape({
      source: yup.mixed().oneOf(['bottle', 'breast']).required(),
      detail: yup.mixed().oneOf(['left', 'right', 'both', 'pumped', 'formula']).required(),
      notes: yup.string(),
    }),

    onSubmit: values => {
      const payload = {
        baby_id: $state.babyId,
        at: $date,
        notes: values.notes,
        event: {
          type: "nursing",
          source: values.source,
          detail: values.detail,
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
          bind:value={$date} />
      </div>

      <RadioGroup
        name="source"
        label="Source"
        options={sources}
        bind:value={$form.source}
        on:change="{event => $form.detail = (event.detail === Source.Breast) ? SourceDetail.Left : SourceDetail.Pumped }" />

      <RadioGroup
        name="source_detail"
        label="Detail"
        options={$form.source === Source.Breast ? breast_details : bottle_details}
        bind:value={$form.detail}/>

      <TextArea
        name="notes"
        label="Notes"
        placeholder="Optional"
        bind:value={$form.notes} />

    </div>
  </Drawer>
</form>
