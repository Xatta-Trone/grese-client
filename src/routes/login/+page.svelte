<!-- @format -->
<script lang="ts">
  import { Button } from "flowbite-svelte";
  import GoogleSignInButton from "$lib/components/GoogleSignInButton.svelte";
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<main class="my-6">
  <!-- <Button href="login-google">Sign in with google</Button> -->
  <div class="w-100 flex justify-center my-20">
    <a href="login-google"><GoogleSignInButton /></a>
  </div>
</main>
