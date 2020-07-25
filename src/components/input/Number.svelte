<script lang="ts">
  // imports

  // props
  export let id: string;
  export let label: string;
  export let placeholder: string;
  export let value: number;

  // these are optional and should not have a default value
  export let min: number = undefined;
  export let max: number = undefined;
</script>

<style>

</style>

<div>
  <label for={id} class="block text-sm leading-5 font-medium text-gray-700">
    {label}
  </label>
  <input
    {id}
    type="number"
    {min}
    {max}
    bind:value
    class="form-input block w-full pl-2 pr-2 sm:text-sm sm:leading-5"
    {placeholder} />
</div>
