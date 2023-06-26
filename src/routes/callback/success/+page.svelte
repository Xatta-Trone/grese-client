<!-- @format -->
<script lang="ts">
  import { A } from "flowbite-svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<svelte:head>
  <title>Trx Success: GRE SE</title>
</svelte:head>

<main>
  {#if data.success == true}
    Thank you for your Subscription.
    <A href="/profile">Go to profile</A>
  {:else}
    Error occurred. Please contact <strong>monzurul.ce.buet@gmail.com</strong>
  {/if}
</main>
