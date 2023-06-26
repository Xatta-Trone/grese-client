<!-- @format -->
<script lang="ts">
  import InfoCircle from "$lib/icons/infoCircle.svelte";
  import type { BadStatusErrorResponse } from "$lib/interfaces/common";
  import type { Data } from "$lib/interfaces/setListData";
  import axiosAPI from "$lib/services/customAxios";
  import type { AxiosError } from "axios";
  import {
    Alert,
    Button,
    Dropdown,
    DropdownItem,
    MenuButton,
    Modal,
  } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import ListFolderComponent from "./ListFolderComponent.svelte";

  const dispatch = createEventDispatcher<{ deleted: Data }>();

  export let setMetaData: Data;
  export let isOwner: boolean;
  let deletePopupModal = false;
  let deleteMessageModal = false;
  let deletedResponseMessage: string = "";
  let isDeletedSuccess = false;

  function deleteHandler() {
    deleteMessageModal = false;
    isDeletedSuccess = false;
    axiosAPI
      .delete(`/saved-lists/${setMetaData.id}`)
      .then(() => {
        deletedResponseMessage = isOwner ? "Set Deleted." : "Set removed.";
        isDeletedSuccess = true;
      })
      .catch((err: AxiosError) => {
        console.log(err.response?.data);
        isDeletedSuccess = false;

        if (err.response?.status && err.response?.status >= 400) {
          const errResponse: BadStatusErrorResponse | any = err.response?.data;
          deletedResponseMessage = errResponse.errors;
        } else {
          deletedResponseMessage = "Error deleting the set.";
        }
      })
      .finally(() => {
        deleteMessageModal = true;
      });
  }

  function emitDeleteEvent() {
    deleteMessageModal = false;
    if (isDeletedSuccess) {
      dispatch("deleted", setMetaData);
    }
  }

  // folders 
  let listFoldersModal = false



</script>

<!-- delete message modal -->
<Modal bind:open={listFoldersModal} title={setMetaData.name} autoclose>
  <ListFolderComponent listMeta={setMetaData} />
</Modal>

<!-- delete message modal -->
<Modal bind:open={deleteMessageModal} size="xs" autoclose>
  <div class="text-center">
    <p class="mx-auto text-5xl mb-4 w-14 text-gray-400 dark:text-gray-200">
      <InfoCircle size="48" />
    </p>
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
      {deletedResponseMessage}
    </h3>
    <Button color="dark" on:click={emitDeleteEvent}>Okay</Button>
  </div>
</Modal>

<!-- delete modal -->
<Modal bind:open={deletePopupModal} size="xs" autoclose>
  <div class="text-center">
    <p class="mx-auto text-5xl mb-3 w-14 text-gray-400 dark:text-gray-200">
      <InfoCircle size="48" />
    </p>
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
      Are you sure you want to {isOwner ? "delete" : "remove"} this ?
    </h3>
    {#if isOwner}
      <Alert color="red" class="text-center">
        <span class="font-medium">Others</span> who have saved this set will also lose access.
      </Alert>
    {/if}

    <Button color="red" class="mr-2 mt-4" on:click={deleteHandler}
      >Yes, I'm sure</Button
    >
    <Button color="alternative">No, cancel</Button>
  </div>
</Modal>
<!-- @format -->
<MenuButton />
<Dropdown class="w-36">
  {#if isOwner}
    <DropdownItem href="/sets/{setMetaData.id}-{setMetaData.slug}/edit">Edit</DropdownItem>
  {/if}

  <DropdownItem on:click={() => (listFoldersModal = true)}>
    Add to folder
  </DropdownItem>

  <DropdownItem on:click={() => (deletePopupModal = true)}>
    {isOwner ? "Delete" : "Remove"}
  </DropdownItem>
</Dropdown>
