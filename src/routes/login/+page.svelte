<!-- @format -->
<script lang="ts">
  import { Button } from "flowbite-svelte";
  import type { PageData } from "./$types";
  import { beforeNavigate } from "$app/navigation";
  import { user } from "$lib/services/auth";
  import { redirect } from "@sveltejs/kit";
  import { redirectHelper } from "$lib/utils/helpers";

  beforeNavigate(() => {
    console.log('first')
    if ($user != null) {
      redirectHelper("/");
    }
  });
</script>

<main class="my-6">
  <Button href="login-google">Sign in with google</Button>
</main>
