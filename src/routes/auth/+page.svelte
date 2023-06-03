<!-- @format -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { setUser } from "$lib/services/auth";
  import { redirect } from "@sveltejs/kit";
  import type { PageData } from "./$types";
  import { browser } from "$app/environment";

  export let data: PageData;

  if (data.success) {
    console.log("data success", browser);
    setUser(data.data.token, data.data.user);
    //   throw redirect(301,'/')
  }

  function go(): null {
    goto("/");
    return null;
    // redirect(302, '/');
  }
</script>

<h1>Auth Success. Redirecting.....</h1>

{#if data.success && browser}
  {setTimeout(() => go(),0)}
{/if}
