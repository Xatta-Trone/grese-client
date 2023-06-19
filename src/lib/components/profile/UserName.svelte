<!-- @format -->
<script lang="ts">
  import PencilIcon from "$lib/icons/pencilIcon.svelte";
  import UserCircle from "$lib/icons/userCircle.svelte";
  import type { BadStatusErrorResponse } from "$lib/interfaces/common";
  import {  user } from "$lib/services/auth";
  import axiosAPI from "$lib/services/customAxios";
  import { updateUser } from "$lib/services/updateUser";
  import type { AxiosError } from "axios";
  import {
    Button,
    Card,
    CloseButton,
    Heading,
    Helper,
    Input,
    Label,
  } from "flowbite-svelte";
  import { onMount } from "svelte";

  let userName = "";
  let isEditing = false;
  let loading = false;

  const nameRegex = /^[a-zA-Z0-9_\-]+$/;
  //   letters numbers _, -

  onMount(() => {
    userName = $user?.username ?? "";
  });

  function changeUserName() {
    console.log(nameRegex.test(userName));

    if (nameRegex.test(userName) == false) {
      alert("Username can only contain letters, numbers dash and underscore");
      return;
    }

    loading = true;

    const data = {
      username: userName,
    };

    axiosAPI
      .put("/update", data)
      .then((res) => {
        console.log(res.data);
        updateUser();
        alert("Username updated");
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
        isEditing = false;
      });
  }
</script>

{#if $user != null}
  <Card size="xl">
    <Heading tag="h5">Username</Heading>
    <Input
      type="text"
      bind:value={userName}
      placeholder="xatta-trone"
      size="md"
      disabled={isEditing == false && loading == false}
      class="my-2"
    >
      <UserCircle slot="left" />

      <button
        slot="right"
        class="cursor-pointer"
        on:click={() => (isEditing = !isEditing)}
      >
        {#if isEditing}
          <CloseButton />
        {:else}
          <PencilIcon />
        {/if}
      </button>
    </Input>
    <Helper class="text-sm"
      >Username must be at least 5 characters and should not contain any special
      character.</Helper
    >
    {#if isEditing}
      <div class="mt-3">
        <Button size="sm" on:click={changeUserName} disabled={loading}
          >Change username</Button
        >
        <Button size="sm" color="red" on:click={() => (isEditing = false)}
          >Cancel</Button
        >
      </div>
    {/if}
  </Card>
{/if}
