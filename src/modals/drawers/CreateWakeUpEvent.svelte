<script lang="ts">
  // npm imports
  import { createEventDispatcher, onMount } from "svelte";
  import { createForm } from "svelte-forms-lib";
  import * as yup from "yup";

  // state imports
  import { state, date } from "~/stores.ts";

  // Forms

  // component imports
  import DatePicker from "~/components/DatePicker.svelte";
  import Drawer from "~/components/Drawer.svelte";
  /*import RadioGroup from "~/components/RadioGroup.svelte";*/
  /*import Text from "~/components/input/Text.svelte";*/
  import TextArea from "~/components/input/TextArea.svelte";

  // props
  export let open: boolean = false;

  const dispatch = createEventDispatcher();

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
      notes: "",
    },

    validationSchema: yup.object().shape({
      notes: yup.string(),
    }),

    onSubmit: values => {
      const payload = {
        id: $state.latest.sleep.id,
        event: {
          type: "sleep",
          woke_up: $date
        }
      };

      state.updateEvent(payload)
        .then(() => dispatch('close'))
        .catch(e => console.error(e));
    }
  });
</script>

<style>

</style>

<form on:submit={handleSubmit}>
  <Drawer
    {open}
    action="submit"
    on:close
    on:cancel={() => dispatch('close')}
    title="New Wake Up Event"
    subtitle="Please enter details below">

    <div class="h-full flex flex-col space-y-6 bg-white overflow-y-scroll">
      <div>
        <DatePicker
          bind:value={$date} />
      </div>

      {#if $state.latest.sleep !== undefined}
        <div class="flex">
          <span>Associated Sleep Event:<span> {$state.latest.sleep.at}
        </div>
      {/if}

      <TextArea
        name="notes"
        label="Notes"
        placeholder="Optional"
        bind:value={$form.notes} />

    </div>
  </Drawer>
</form>
