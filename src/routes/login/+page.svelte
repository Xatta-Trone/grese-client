<!-- @format -->
<script lang="ts">
import GoogleSignInButton from "$lib/components/GoogleSignInButton.svelte";
import {
  A,
  P
} from "flowbite-svelte";
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<main class="my-60">
  <!-- <Button href="login-google">Sign in with google</Button> -->
  <div class="w-100 flex justify-center">
    <a href="login-google"><GoogleSignInButton /></a>
  </div>
  <div class="text-center mt-4">
    <P class="text-center">By registering you are accepting our <A href="/privacy-policy" class="font-medium hover:underline">Privacy Policy</A> & <A href="terms-and-conditions" class="font-medium hover:underline">Terms and Conditions</A></P>
  </div>
</main>
