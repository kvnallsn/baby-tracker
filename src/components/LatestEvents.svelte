<script lang="ts">
  // npm imports
  import Spinner from "svelte-spinner";

  // component imports
  import Card from "~/components/Card.svelte";
  import FlatButton from "~/components/FlatButton.svelte";

  // state imports
  import { state } from "~/stores.ts";

  /* An object containing references to the latest of each class of events */
  export let data;
</script>

<style>
</style>

<div class="w-full grid grid-cols-1 row-gap-4 md:grid-cols-3 md:col-gap-16 md:row-gap-0">
  <Card title="Diaper Change">
    {#if data.diaper === undefined}
      No diaper changes found.
    {:else}
      <div class="flex justify-between text-xs text-gray-400 italic">
        <span>{data.diaper.at.toLocaleDateString($state.locale)}</span>
        <span>{data.diaper.at.toLocaleTimeString($state.locale)}</span>
      </div>
      <hr class="py-2" />
      <p class="text-gray-600 text-base">
        {data.diaper.event.detail.get_condition()}, {data.diaper.event.detail.get_leakage()}
      </p>
    {/if}
    <div class="flex justify-start" slot="footer">
      <FlatButton text="New" />
    </div>
  </Card>
  <Card title="Nursing">
    {#if data.nursing === undefined}
      No nursings found.
    {:else}
      <div class="flex justify-between text-xs text-gray-400 italic">
        <span>{data.nursing.at.toLocaleDateString($state.locale)}</span>
        <span>{data.nursing.at.toLocaleTimeString($state.locale)}</span>
      </div>
      <hr class="py-2" />
      <p class="text-gray-600 text-base">
        {data.nursing.event.detail.get_source()}, {data.nursing.event.detail.get_detail()}
      </p>
    {/if}
    <div class="" slot="footer">
    </div>
  </Card>
  <Card title="Sleep">
    {#if data.sleep === undefined}
      No sleep events found
    {:else}
      <div class="flex justify-between text-xs text-gray-400 italic">
        <span>{data.sleep.at.toLocaleDateString($state.locale)}</span>
        <span>{data.sleep.at.toLocaleTimeString($state.locale)}</span>
      </div>
      <hr class="py-2" />
      <p class="text-gray-600 text-base">
        {#if data.sleep.event.detail.woke_up}
          Woke up at {data.sleep.event.detail.woke_up.toLocaleString('en-US')} 
        {:else}
          Baby still snoozing
        {/if}
      </p>
    {/if}
    <div class="justify-start items-end" slot="footer">
      <FlatButton text="WOKE UP" color="primary" />
    </div>
  </Card>
</div>
