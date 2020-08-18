<script lang="ts">
  import { getContext } from 'svelte';
  import { toastKey } from '~/toast.ts';

  const { getToast } = getContext(toastKey);
  const toasts = getToasts();

</script>

<div class="fixed bottom-0 w-full flex flex-col items-center mb-4 divide-y-4 divide-white" class:hidden={toasts.length == 0}>
  {#each $toasts as toast}
    <div class="rounded-lg bg-primary-700 text-white text-center py-2 px-8">
      {toast}
    </div>
  {/each}
</div>
