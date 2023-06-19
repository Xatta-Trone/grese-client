<!-- @format -->
<script lang="ts">
  import PencilIcon from "$lib/icons/pencilIcon.svelte";
  import TicketIcon from "$lib/icons/ticketIcon.svelte";
  import UserCircle from "$lib/icons/userCircle.svelte";
  import type { BadStatusErrorResponse } from "$lib/interfaces/common";
  import { user, type MeEndpointResponse } from "$lib/services/auth";
  import axiosAPI from "$lib/services/customAxios";
  import { updateUser } from "$lib/services/updateUser";
  import type { AxiosError } from "axios";
  import {
    Button,
    Card,
    Heading,
    Input,
    Label,
    Modal,
    P,
  } from "flowbite-svelte";
  import { onMount } from "svelte";

  let expires: Date = new Date(0);
  let isPremium = false;
  let isPremiumExpired = false;
  let clickOutsideModal = false;
  let couponCode = "";
  let loading = false;

  onMount(() => {
    getUserData();
    determineUserState($user?.expires_on ?? null);
  });

  function getUserData() {
    axiosAPI.get("/me").then((res) => {
      const response: MeEndpointResponse = res.data;
      console.log("subscription", response);
      determineUserState(response.data.expires_on);
    });
  }

  function determineUserState(date: Date | null) {
    expires = new Date(date ?? 0);
    isPremium = expires.getTime() > 0;
    isPremiumExpired = expires.getTime() > 0 && expires.getTime() < Date.now(); //is it still valid?
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
        getUserData();
        updateUser();
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

{#if $user != null}
  <Card size="xl">
    <Heading tag="h5">Subscription</Heading>
    {#if isPremium == false || isPremiumExpired}
      <div class="mt-4">
        <Button color="dark">Upgrade to GRE SE+</Button>
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
{/if}
