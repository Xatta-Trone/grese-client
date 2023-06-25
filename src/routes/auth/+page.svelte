<!-- @format -->
<script lang="ts">
  import { browser } from "$app/environment";
  import { setUser } from "$lib/services/auth";
  import { INTENDED_KEY } from "$lib/utils/constants";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  let intended: string = "/profile";

  if (data.success) {
    console.log("data success", browser);
    setUser(data.data.token, data.data.user, data.data.exp);
    //   throw redirect(301,'/')
  }

  onMount(() => {
    const I = localStorage.getItem(INTENDED_KEY);
    console.log(localStorage.getItem(INTENDED_KEY));

    if (I) {
      intended = I;
    }

    localStorage.removeItem(INTENDED_KEY);
  });
</script>

<svelte:head>
  <title>Auth Success: GRE SE</title>
</svelte:head>

<h1>Auth Success. Redirecting.....</h1>

{#if data.success && browser}
  <!-- Magic number: {setTimeout(() => redirectHelper(intended), 0)} -->
  Magic number: {setTimeout(() => window.location.href = intended, 0)}
{/if}
