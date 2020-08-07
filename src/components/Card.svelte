<script lang="ts">
  // props
  export let title: string;
  export let src: string;
  export let alt: string;
</script>

<div class="max-w-sm rounded overflow-hidden shadow-md">
  <div class="w-full h-32 p-4">
    <img class="w-full h-full" {src} {alt}>
  </div>
  <div class="px-6 py-4">
    <div class="font-bold text-lg">{title}</div>
    <slot></slot>
  </div>
  <div class="px-2 pb-2">
    <slot name="footer">
    </slot>
  </div>
</div>
