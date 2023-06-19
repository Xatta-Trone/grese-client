<!-- @format -->
<script>
  import { PUBLIC_NODE_ENV } from "$env/static/public";
</script>
{#if PUBLIC_NODE_ENV == "development"}
  <div class="p-5 border border-slate-950 break-all">
    <slot />
  </div>
{/if}
