<script lang="ts">
  export let defaultClass:string = "w-6 h-6 text-red-600 dark:text-red-500";
  export let size:string = "24";
</script>
<svg
  xmlns="http://www.w3.org/2000/svg"
  class={defaultClass}
  width="{size}"
  height="{size}"
  viewBox="0 0 24 24"
  stroke-width="2"
  stroke="currentColor"
  fill="none"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  <path d="M10 10l4 4m0 -4l-4 4" />
</svg>
