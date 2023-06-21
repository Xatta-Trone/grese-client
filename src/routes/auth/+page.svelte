<!-- @format -->
<script lang="ts">
  import { setUser } from "$lib/services/auth";
  import type { PageData } from "./$types";
  import { browser } from "$app/environment";
  import { redirectHelper } from "$lib/utils/helpers";
  import { onMount } from "svelte";
  import { INTENDED_KEY } from "$lib/utils/constants";
  import { goto } from "$app/navigation";

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

<h1>Auth Success. Redirecting.....</h1>

{#if data.success && browser}
  Magic number: {setTimeout(() => goto(intended, { replaceState: true }), 0)}
{/if}
