<!-- @format -->
<script lang="ts">
  import { setUser } from "$lib/services/auth";
  import type { PageData } from "./$types";
  import { browser } from "$app/environment";
  import { redirectHelper } from "$lib/utils/helpers";

  export let data: PageData;

  if (data.success) {
    console.log("data success", browser);
    setUser(data.data.token, data.data.user);
    //   throw redirect(301,'/')
  }
</script>
<h1>Auth Success. Redirecting.....</h1>

{#if data.success && browser}
  {setTimeout(() => redirectHelper("/"), 0)}
{/if}
