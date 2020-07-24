<script lang="ts">
  // imports

  // props
  export let id: string;
  export let label: string;
  export let placeholder: string;
  export let rows: number = 5;
</script>

<style>

</style>

<div>
  <label for={id} class="block text-sm leading-5 font-medium text-gray-700">
    {label}
  </label>
  <textarea
    {id}
    {rows}
    {placeholder}
    class="form-input block w-full pl-2 pr-2 sm:text-sm sm:leading-5" />
</div>
