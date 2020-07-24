<script lang="ts">
  import CreateRecordDrawer from "./CreateRecordDrawer.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Tailwind from "./components/Tailwind.svelte";

  let alertVisible: boolean = false;
  let drawerVisible: boolean = true;
</script>

<style>
  .header {
    @apply px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider;
  }
</style>

<Tailwind />
<Navbar on:showCreateRecord={(e) => (drawerVisible = true)} />
<CreateRecordDrawer
  open={drawerVisible}
  on:close={(_e) => (drawerVisible = false)} />
<div class="max-w-6xl w-full mx-auto">
  <span class="text-3xl p-2">Nursing</span>
  <hr class="my-1" />
  <div class="flex flex-col">
    <div class="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div
        class="align-middle inline-block min-w-full shadow overflow-hidden
        sm:rounded-lg border-b border-gray-200">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="header">Date</th>
              <th class="header">Time</th>
              <th class="header">Method</th>
              <th class="header">Side</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  </div>
</div>
