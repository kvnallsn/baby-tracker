<script lang="ts">
  // npm imports
  import { createEventDispatcher, onMount } from "svelte";
  import { createForm } from "svelte-forms-lib";
  import * as yup from "yup";

  // state imports
  import { state } from "~/stores.ts";

  // Models
  import * as api from "~/api.ts";
  import { Source, SourceDetail} from "~/api/event.ts";

  // Forms

  // component imports
  import DatePicker from "~/components/DatePicker.svelte";
  import Drawer from "~/components/Drawer.svelte";
  import RadioGroup from "~/components/RadioGroup.svelte";
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
      source: Source.Breast,
      detail: SourceDetail.Left,
      notes: "",
    },

    validationSchema: yup.object().shape({
      at: yup.date().required(),
      source: yup.mixed().oneOf(['bottle', 'breast']).required(),
      detail: yup.mixed().oneOf(['left', 'right', 'both', 'pumped', 'formula']).required(),
      notes: yup.string(),
    }),

    onSubmit: async values => {
      const payload = {
        baby_id: $state.babyId,
        at: values.at,
        notes: values.notes,
        event: {
          type: "nursing",
          source: values.source,
          detail: values.detail,
        }
      };

      try {
        const event = await api.createEvent(payload);
        dispatch('success', event);
        dispatch('close');
      } catch (error) {
        dispatch('failed', error);
      }
    }
  });

  // reactive data
  $: if (open) { $form.at = new Date() }
</script>

<style>

</style>

<form on:submit={handleSubmit}>
  <Drawer
    {open}
    action="submit"
    on:close
    on:cancel={() => dispatch('close')}
    title="New Nursing Event"
    subtitle="Please enter details below">

    <div class="h-full flex flex-col space-y-6 bg-white overflow-y-scroll">
      <div>
        <DatePicker
          bind:value={$form.at} />
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
