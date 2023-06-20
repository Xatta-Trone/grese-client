<!-- @format -->
<script lang="ts">
  import Subscription from "$lib/components/profile/Subscription.svelte";
  import UserName from "$lib/components/profile/UserName.svelte";
  import { onMount } from "svelte";
  import type { PageServerData } from "./$types";
  import type { MeEndpointResponse, UserInterface } from "$lib/services/auth";
  import axiosAPI from "$lib/services/customAxios";
  import { Heading } from "flowbite-svelte";

  let userData: UserInterface | null;

  export let data: PageServerData;

  onMount(async () => {
    console.log("user profile component", data.user);
    // userData = data?.user;
    await getUserProfileData();
  });

  async function getUserProfileData() {
    await axiosAPI.get("/me").then((res) => {
      const response: MeEndpointResponse = res.data;
      console.log("layout user call", response);
      userData = response.data;
    });
  }
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<main class="my-6">
  {#if userData == null}
     <Heading tag="h5">Loading...&#128516;</Heading>
  {:else}
  
  <div id="username">
    <UserName username={userData?.username ?? ""} />
  </div>

  <div id="subscription" class="my-4">
    <Subscription />
  </div>
  {/if}
</main>
