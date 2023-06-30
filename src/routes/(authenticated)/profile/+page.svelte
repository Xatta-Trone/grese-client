<!-- @format -->
<script lang="ts">
  import Subscription from "$lib/components/profile/Subscription.svelte";
  import UserName from "$lib/components/profile/UserName.svelte";
  import type { MeEndpointResponse, UserInterface } from "$lib/services/auth";
  import axiosAPI from "$lib/services/customAxios";
  import {
    A,
    Card,
    Heading,
    P,
    TextPlaceholder
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import type { PageServerData } from "./$types";
  import { version } from '$app/environment';

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
  version

</script>

<svelte:head>
  <title>{(userData?.username ?? "My profile").toUpperCase()}: GRE SE</title>
</svelte:head>

<main class="my-6" in:fade>
  {#if userData == null}
    <TextPlaceholder size="xxl" class="mt-8" />
    <TextPlaceholder size="xxl" class="mt-8" />
  {:else}
    <div id="username" class="my-8">
      <UserName username={userData?.username ?? ""} />
    </div>
    <div id="subscription" class="my-8">
      <Subscription userData={userData} />
    </div>

    <div class="my-8">
      <Card size="xl">
        <Heading tag="h5" color="text-red-600 dark:text-red-500"
          >Danger Zone</Heading
        >
        <P
          >To delete your account, please send an email to <A
            rel="external"
            target="_blank"
            href="mailto:support@gre-sentence-equivalence.com"
            >support@gre-sentence-equivalence.com</A
          >
        </P>
      </Card>
    </div>
  {/if}
  <P class="mt-3" weight="light" color="text-gray-500 dark:text-gray-400">
  Website Version: {version}
</P>
</main>
