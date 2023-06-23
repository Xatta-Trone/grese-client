<!-- @format -->
<script lang="ts">
  import { logout, user, type UserInterface } from "$lib/services/auth";
  import { Alert } from "flowbite-svelte";
  import { onMount } from "svelte";

  let u: UserInterface|null

  user.subscribe(val => u = val)

  onMount(() => {

    console.log(history)

  })

</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<section>
  <Alert>
    <span class="font-medium"> Info alert!</span> aaa Change a few things up and try submitting
    again.
  </Alert>

  {JSON.stringify(u)}

  <a href="/login">Login</a>
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a on:click={() => logout()} href="#">Logout</a>
  <a href="/logout">Logout2</a>

  <h2>
    try editing <strong>src/routes/+page.svelte</strong>
  </h2>
</section>

<style>
</style>
