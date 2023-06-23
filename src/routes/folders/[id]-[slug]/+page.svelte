<!-- @format -->
<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import CloseIcon from "$lib/icons/closeIcon.svelte";
  import bot from "$lib/images/bot.png";
  import type { Folder, List as FolderList, Meta, SingleFolderResponse } from "$lib/interfaces/folderResponse";
  import axiosAPI from "$lib/services/customAxios";
  import { INTENDED_KEY } from "$lib/utils/constants";
  import { redirectHelper } from "$lib/utils/helpers";
  import type { AxiosResponse } from "axios";
  import { Alert, Avatar, Button, Card, Heading, Select, TextPlaceholder, } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { inview } from "svelte-inview/dist/index";
  import type { PageData } from "./$types";

  export let data: PageData;

  // data variables
  let currentPage = 1;
  let per_page = 20;
  let lists: FolderList[] = [];
  let newLists: FolderList[] = [];
  let meta: Meta;
  let folderMeta: Folder;
  let loading = false;
  let hasMore = true;
  let query: string = "";
  let orderBy = "id";
  let orderDir = "asc";

  $: lists = [...lists, ...newLists];

  // fetch data
  async function fetchData() {
    loading = true;
    await axiosAPI
      .get(
        `/folders/${$page.params.id}?page=${currentPage}&per_page=${per_page}&query=${query}&order_by=${orderDir}&order=${orderBy}`
      )
      .then((res) => {
        const data: SingleFolderResponse = res.data;
        // console.log(data);
        if (meta == undefined) {
          meta = data.meta;
        }
        if (folderMeta == undefined) {
          folderMeta = data.folder;
        }

        if (data.lists.length) {
          newLists = data.lists;
          hasMore = data.lists.length <= per_page ? true : false;
        } else {
          hasMore = false;
        }
      })
      .finally(() => (loading = false));
  }

  function loadMore() {
    if (!hasMore) return;
    currentPage++;
    fetchData();
  }

  onMount(() => {
    fetchData();
  });

  function handleLoginToSave() {
    if (browser) {
      localStorage.setItem(INTENDED_KEY, $page.url.pathname + $page.url.search);
    }

    redirectHelper("/login");
  }

   // =========================
  // sorting
  // =========================

  let selected: string = "default";
  let filters = [
    { value: "default", name: "Default" },
    { value: "az", name: "Ascending" },
    { value: "za", name: "Descending" },
  ];

  function handleFilter() {
    //   let orderBy = "id";
    // let orderDir = "asc";
    switch (selected) {
      case "az":
        orderBy = "slug";
        orderDir = "asc";
        break;
      case "za":
        orderBy = "slug";
        orderDir = "desc";
        break;

      default:
        orderBy = "id";
        orderDir = "desc";
        break;
    }

    // set page 1
    currentPage = 1;
    lists = [];
    newLists = [];
    loading = false;
    fetchData();
  }

  // =========================
  // set save function
  // =========================
  let saving = false;
  let saveSuccess: string | null = null;
  let saveError: string | null = null;
  function handleSave() {
    saving = true;
    console.log("handle save");

    if (data.user == null) {
      redirectHelper("/login", $page.url);
      return;
    }

    // continue to save
    axiosAPI
      .post(`/saved-folders/${folderMeta.id}`)
      .then((res: AxiosResponse) => {
        if (res.status == 201) {
          saveSuccess = "Saved successfully.";
        } else {
          saveError = "There was an error while saving.";
        }
      })
      .catch((err) => {
        console.log(err.response);
        saveError = "Error saving the folder.";
      })
      .finally(() => {
        saving = false;
      });
  }
</script>

<main class="my-6">
  {#if folderMeta}
    <Heading tag="h2" class="my-10">{folderMeta.name}</Heading>
  {/if}

  {#if folderMeta}
    <div class="flex justify-between my-8">
      <a class="flex items-center space-x-4" href="/@{folderMeta.user.username}">
        <Avatar src={bot} size="sm" />
        <div class="space-y-1 font-medium dark:text-white">
          <div class="font-bold">{folderMeta.user.username}</div>
        </div>
      </a>
      <div class="font-bold">
        {#if data.user == null}
          <Button color="dark" on:click={handleLoginToSave}>Login to save</Button>
        {:else if data.user.id == folderMeta.user_id}
          <Button color="dark">Edit</Button>
        {:else}
          <Button color="dark" on:click={handleSave} disabled={saving}>Save</Button>
        {/if}
      </div>
    </div>
  {/if}

     {#if saveError}
    <Alert color="red" dismissable class="my-1">
      <span slot="icon"><CloseIcon /></span>
      {saveError}
    </Alert>
  {/if}

  {#if saveSuccess}
    <Alert color="green" dismissable class="my-1">
      <span slot="icon"><CloseIcon /></span>
      {saveSuccess}
    </Alert>
  {/if}

  {#if folderMeta}
    <div class="flex flex-col md:flex-row items-center">
      <Heading tag="h4" class="my-6"
      >{folderMeta.lists_count ?? 0}
      {folderMeta.lists_count > 1 ? "sets" : "set"} in this folder</Heading
    >
      <div>
        <Select
          size="md"
          items={filters}
          bind:value={selected}
          on:change={handleFilter}
          placeholder="Sort by..."
        />
      </div>
    </div>
  {/if}

  {#each lists as set}
    <Card size="xl" href="/sets/{set.id}-{set.slug}" class="mb-3">
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        {set.name}
      </h5>
      <div class="flex justify-between mt-2">
        <a class="flex items-center space-x-4" href="/@{set.user.username}">
          <Avatar src={bot} size="xs" />
          <div class="space-y-1 font-medium dark:text-white">
            <div>{set.user.username}</div>
          </div>
        </a>
        <div>{set.word_count} {set.word_count > 1 ? "words" : "word"}</div>
      </div>
    </Card>
  {/each}
  <div use:inview={{}} on:change={loadMore} />


   {#if loading}
    {#each Array(10) as _, index (index)}
      <TextPlaceholder size="xxl" class="mt-8" />
    {/each}
  {/if}


  {#if lists.length == 0 && !hasMore && !loading}
    <Heading tag="h5">Nothing found. &#128532;</Heading>
  {/if}

  {#if lists.length > 0 && !hasMore}
    <Heading tag="h6" color="text-gray-600 dark:text-white mt-5"
      >End of results &#128522;</Heading
    >
  {/if}
</main>
