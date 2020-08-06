<script lang="ts">
  // npm imports

  // props
  export let id: string = "toggle";
  export let name: string = "toggle";
 
  // local mutable data
  let toggle: boolean = false;
</script>

<style>
  .label-on {
    @apply translate-x-full border-primary-400;
  }

  .label-off {
    @apply translate-x-0 border-gray-400;
  }
</style>

<div
  class="relative rounded-full w-12 h-6 transition duration-200 ease-linear"
  class:bg-primary-400={toggle}
  class:bg-gray-400={!toggle}
>
  <label
    for="toggle"
    class="absolute left-0 bg-white border-2 mb-2 w-6 h-6 rounded-full transition transform duration-100 ease-linear cursor-pointer"
    class:label-on={toggle}
    class:label-off={!toggle}
  >

  <input
    {id}
    {name}
    type="checkbox"
    class="appearance-none w-full h-full active:outline-none focus:outline-none"
    on:click="{_e => toggle = !toggle}"
  >
</div>
