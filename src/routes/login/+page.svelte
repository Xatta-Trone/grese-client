<!-- @format -->
<script lang="ts">
  import { page } from "$app/stores";
  import GoogleSignInButton from "$lib/components/GoogleSignInButton.svelte";
  import { A, P } from "flowbite-svelte";
  import { onMount } from "svelte";

  let promoCode: string|null = "";

  onMount(() => {
    const promo = $page.url.searchParams.get("promo")
    if (promo != null || promo != undefined || promo != "") {
      promoCode = promo
    }
  });
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<main class="w-100 h-screen flex justify-center items-center">
  <div>
    <div class="w-100 flex justify-center itemx">
      <a href={promoCode ? `/login-google?promo=${promoCode}` : `/login-google`}><GoogleSignInButton /></a>
    </div>
    <div class="text-center mt-4">
      <P class="text-center"
        >By registering you are accepting our <A
          href="/privacy-policy"
          class="font-medium hover:underline">Privacy Policy</A
        > & <A href="terms-and-conditions" class="font-medium hover:underline"
          >Terms and Conditions</A
        ></P
      >
    </div>
  </div>
</main>
