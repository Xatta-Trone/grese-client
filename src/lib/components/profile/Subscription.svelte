<!-- @format -->
<script lang="ts">
  import TicketIcon from "$lib/icons/ticketIcon.svelte";
  import type { BadStatusErrorResponse } from "$lib/interfaces/common";
  import type { CookieMaker } from "$lib/interfaces/cookiesInterface";
  import {
    user,
    type MeEndpointResponse,
    type UserInterface
  } from "$lib/services/auth";
  import axiosAPI from "$lib/services/customAxios";
  import { COOKIE_KEY_USER } from "$lib/utils/constants";
  import type { AxiosError } from "axios";
  import { Button, Card, Heading, Input, Modal, P } from "flowbite-svelte";
  import { onMount } from "svelte";

  let expires: Date = new Date(0);
  let isPremium = false;
  let isPremiumExpired = true;
  let clickOutsideModal = false;
  let couponCode = "";
  let loading = false;
  let initLoading = true;
  export let userData: UserInterface;

  onMount(async () => {
    getUserData();
    determineUserState($user?.expires_on ?? null);
  });

  function getUserData() {
    initLoading = true;
    axiosAPI.get("/me").then((res) => {
      const response: MeEndpointResponse = res.data;
      setUserData(response.data);
      console.log("subscription", response);
      determineUserState(response.data.expires_on);
    });
  }

  function determineUserState(date: Date | null) {
    expires = new Date(date ?? 0);
    isPremium = expires.getTime() > 0;
    isPremiumExpired = expires.getTime() > 0 && expires.getTime() < Date.now(); //is it still valid?
    setTimeout(() => {
      initLoading = false;
    }, 500);
  }

  function setUserData(user: UserInterface) {
    const data: CookieMaker = {
      key: COOKIE_KEY_USER,
      value: JSON.stringify(user),
      // expires: "Wed, 05 Jul 2023 07:19:58 GMT",
    };

    const formData = new FormData();
    formData.append("cookies", JSON.stringify([data]));

    fetch("/cookies", {
      method: "POST",
      body: formData,
    });
  }

  function submitCoupon() {
    loading = true;

    const data = {
      coupon: couponCode,
    };

    axiosAPI
      .post("/upgrade-user", data)
      .then((res) => {
        console.log(res.data);
        couponCode = "";
        clickOutsideModal = false;
        const response: MeEndpointResponse = res.data;
        setUserData(response.data);
        getUserData();
        alert("Upgraded to GRE SE +");
      })
      .catch((err: AxiosError) => {
        console.log(err.response);
        if (err.response?.status == 400) {
          const errData: BadStatusErrorResponse | any = err.response?.data;
          alert(errData.errors);
        } else {
          alert(err.message);
        }
      })
      .finally(() => {
        loading = false;
      });
  }
</script>

<Modal title="Upgrade to premium" bind:open={clickOutsideModal} outsideclose>
  <Input
    type="text"
    placeholder="xatta-trone"
    size="md"
    bind:value={couponCode}
  >
    <TicketIcon slot="left" />
  </Input>
  <Button disabled={couponCode.length == 0 || loading} on:click={submitCoupon}
    >Upgrade to GRE SE+</Button
  >
</Modal>

{#if initLoading == false}
  <Card size="xl">
    <Heading tag="h5">Subscription</Heading>
    {#if isPremium == false || isPremiumExpired}
      <div class="mt-4">
        <Button color="dark" href={`/api/stripe-checkout?user=${userData.id}&email=${userData.email}`}
          >Upgrade to GRE SE+</Button
        >
        <Button color="red" on:click={() => (clickOutsideModal = true)}
          >I have a spacial coupon</Button
        >
      </div>
    {:else}
      <P
        >Thanks for your support. Your subscription expires on <strong
          class="inline">{expires.toUTCString()}</strong
        ></P
      >
    {/if}
  </Card>
{:else}
  <Heading tag="h5">Loading subscription status...&#128516;</Heading>
{/if}
