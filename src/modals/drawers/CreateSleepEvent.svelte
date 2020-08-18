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
  import TextArea from "~/components/input/TextArea.svelte";

  // props
  export let open: boolean = false;

  const dispatch = createEventDispatcher();

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
      notes: "",
    },

    validationSchema: yup.object().shape({
      at: yup.date().required(),
      notes: yup.string(),
    }),

    onSubmit: values => {
      const payload = {
        baby_id: $state.babyId,
        at: values.at,
        notes: values.notes,
        event: {
          type: "sleep",
        }
      };

      api.createEvent(payload)
        .then(event => dispatch('success', event))
        .then(() => dispatch('close'))
        .catch(e => dispatch('failed', e));
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
    title="New Sleep Event"
    subtitle="Please enter details below">

    <div class="h-full flex flex-col space-y-6 bg-white overflow-y-scroll">
      <div>
        <DatePicker
          bind:value={$form.at} />
      </div>

      <TextArea
        name="notes"
        label="Notes"
        placeholder="Optional"
        bind:value={$form.notes} />

    </div>
  </Drawer>
</form>
