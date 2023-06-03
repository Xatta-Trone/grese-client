<!-- @format -->
<script lang="ts">
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

<section>
    <h2>{JSON.stringify(userData)}</h2>
</section>
<style>
</style>
