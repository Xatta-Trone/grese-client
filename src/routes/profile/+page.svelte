<!-- @format -->
<script lang="ts">
  import UserName from "$lib/components/profile/UserName.svelte";
import { user } from "$lib/services/auth";
  import type { UserInterface } from "$lib/services/auth";

  let userData: UserInterface | null;

  user.subscribe((value) => {
    userData = value;
  });

</script>
<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<main class="my-6">
  <UserName/>
</main>
