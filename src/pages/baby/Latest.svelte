<script lang="ts">
  // npm imports
  import { onMount } from "svelte";
  import Spinner from "svelte-spinner";

  // component imports
  import Card from "~/components/Card.svelte";
  import FlatButton from "~/components/FlatButton.svelte";

  // api imports
  import * as api from "~/api.ts";

  // state imports
  import { state } from "~/stores.ts";

  // svg imports
  import diaper from "~/svg/010-diaper.svg";
  import bottle from "~/svg/004-feeding bottle.svg";
  import night from "~/svg/026-night.svg";

  onMount(async () => {
    await state.refreshLatest($state.babyId);
  });
</script>

<style>
</style>

{#if $state.latest.refreshing}
  <div class="grid w-full bg-gray-50 shadow-inner" style="place-items: center; height: 278px">
    <Spinner
      size="100"
      speed="1000"
      color="#C53030"
      thickness="2"
      gap="50"
      />
  </div>
{:else}
  <div class="w-full grid grid-cols-1 row-gap-4 md:grid-cols-3 md:col-gap-16 md:row-gap-0">
    <Card src={diaper} alt="diaper" title="Diaper Change">
      {#if $state.latest.diaper === undefined}
        No diaper changes found.
      {:else}
        <div class="flex justify-between text-xs text-gray-400 italic">
          <span>{$state.latest.diaper.at.toLocaleDateString($state.locale)}</span>
          <span>{$state.latest.diaper.at.toLocaleTimeString($state.locale)}</span>
        </div>
        <hr class="py-2" />
        <p class="text-gray-600 text-base">
          {$state.latest.diaper.event.detail.get_condition()}, {$state.latest.diaper.event.detail.get_leakage()}
        </p>
      {/if}
      <div class="flex justify-start" slot="footer">
        <FlatButton text="New" />
      </div>
    </Card>
    <Card src={bottle} alt="nursing" title="Nursing">
      {#if $state.latest.nursing === undefined}
        No nursings found.
      {:else}
        <div class="flex justify-between text-xs text-gray-400 italic">
          <span>{$state.latest.nursing.at.toLocaleDateString($state.locale)}</span>
          <span>{$state.latest.nursing.at.toLocaleTimeString($state.locale)}</span>
        </div>
        <hr class="py-2" />
        <p class="text-gray-600 text-base">
          {$state.latest.nursing.event.detail.get_source()}, {$state.latest.nursing.event.detail.get_detail()}
        </p>
      {/if}
      <div class="" slot="footer">
      </div>
    </Card>
    <Card src={night} alt="sleep" title="Sleep">
      {#if $state.latest.nursing === undefined}
        No sleep events found
      {:else}
        <div class="flex justify-between text-xs text-gray-400 italic">
          <span>{$state.latest.sleep.at.toLocaleDateString($state.locale)}</span>
          <span>{$state.latest.sleep.at.toLocaleTimeString($state.locale)}</span>
        </div>
        <hr class="py-2" />
        <p class="text-gray-600 text-base">
          {#if $state.latest.sleep.event.detail.woke_up}
            Woke up at {$state.latest.sleep.event.detail.woke_up.toLocaleString('en-US')} 
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
{/if}
