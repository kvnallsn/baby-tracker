<script lang="ts">
  // svelte
  import { setContext } from "svelte";
  import { writable } from 'svelte/store';
  import { fade } from "svelte/transition";

  // routify
  import { Router } from "@sveltech/routify";
  import { routes } from "@sveltech/routify/tmp/routes";

  import { nanoid } from "nanoid";

  // local imports
  import GlobalStyle from "~/GlobalStyle.svelte";
  import { toastKey } from "~/context.ts";

  const toasts = writable(new Map());
  setContext(toastKey, {
    /**
     * Shows a new toast message in the Toast container.
     *
     * @param toast [string] Text to show
     * @param opts  [ToastOptions] Toast Options
     */
    addToast: (toast: string, opts: any) => {
      // generate a unique id for this toast
      // this id will be used to delete the toast when
      // the timeout expires
      let id = nanoid();

      // default timeout is 3 seconds (or 3000 milliseconds)
      const timeout = opts.timeout || 3000;

      // default color is primary
      const color = opts.color || 'bg-primary-700';

      toasts.update(t => {
        t.set(id, { id: id, text: toast, color: color });
        return t;
      });

      if (timeout > 0) {
        setTimeout(() => toasts.update(t => {
          t.delete(id);
          return t;
        }), timeout);
      }
    }
  });
</script>

<style>
  .layout {
    display: grid;
    grid-template-rows: auto 1fr;
  }
</style>

<GlobalStyle />
<Router {routes} />
<div class="fixed bottom-0 w-full flex flex-col items-center mb-4 divide-y-4 divide-white" class:hidden={$toasts.length == 0}>
  {#each [...$toasts.values()] as toast}
    <div
      transition:fade="{{ duration: 150 }}"
      class={`rounded-lg ${toast.color} text-white text-center py-2 pl-2 pr-8 flex justify-start`}
    >
      <button
        type="button"
        aria-label="Close toast"
        on:click={() => toasts.update(t => { t.delete(toast.id); return t; })}
        class="transition ease-in-out duration-150 pr-4">
        <svg
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {toast.text}
    </div>
  {/each}
</div>

<!--
  attribution
  Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
-->
