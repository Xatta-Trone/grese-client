<!-- @format -->
<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import PencilIcon from "$lib/icons/pencilIcon.svelte";
  import UserCircle from "$lib/icons/userCircle.svelte";
  import type { BadStatusErrorResponse } from "$lib/interfaces/common";
  import axiosAPI from "$lib/services/customAxios";
  import type { AxiosError } from "axios";
  import {
    Button,
    Card,
    CloseButton,
    Heading,
    Helper,
    Input,
  } from "flowbite-svelte";

  export let username: string;

  let isEditing = false;
  let loading = false;

  const nameRegex = /^[a-zA-Z0-9_\-]+$/;

  function changeUserName() {
    console.log(nameRegex.test(username));

    if (nameRegex.test(username) == false) {
      alert("Username can only contain letters, numbers dash and underscore");
      return;
    }

    loading = true;

    const data = {
      username: username,
    };

    axiosAPI
      .put("/update", data)
      .then((res) => {
        console.log(res.data);
        alert("Username updated");
        invalidateAll();
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

{#if username != ""}
  <Card size="xl">
    <Heading tag="h5">Username</Heading>
    <Input
      type="text"
      bind:value={username}
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
          >Update username</Button
        >
        <Button size="sm" color="red" on:click={() => (isEditing = false)}
          >Cancel</Button
        >
      </div>
    {:else}
      <div class="mt-3">
        <Button size="sm" on:click={() => (isEditing = true)} disabled={loading}
          >Change username</Button
        >
      </div>
    {/if}
  </Card>
{/if}
