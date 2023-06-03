<!-- @format -->
<script lang="ts">
  import { Alert } from "flowbite-svelte";
  import { user, logout } from "$lib/services/auth";
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<section>
  <Alert>
    <span class="font-medium">Info alert!</span> Change a few things up and try submitting
    again.
  </Alert>

  <a href="/login">Login</a>
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a on:click={() => logout()} href="#">Logout</a>

  <h2>
    try editing <strong>src/routes/+page.svelte</strong>
  </h2>
</section>

<style>
</style>
