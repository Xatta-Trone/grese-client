<!-- @format -->
<script lang="ts">
  import { page } from "$app/stores";
  import { user, type UserInterface } from "$lib/services/auth";
  import { Avatar, Badge, Button, Card, Heading, P } from "flowbite-svelte";
  import type { PageData } from "./$types";
  import axiosAPI from "$lib/services/customAxios";
  import { onMount } from "svelte";
  import bot from "$lib/images/bot.jpg";
  import { inview } from "svelte-inview/dist/index";

  export let data: PageData;

  console.log($page.params.id, $page.params.slug);

  let u: UserInterface | null;

  user.subscribe((value) => {
    u = value;
  });

  // interface
  interface SingleFolderResponse {
    folder: Folder;
    lists: List[];
    meta: Meta;
  }

  interface Folder {
    id: number;
    user_id: number;
    list_meta_id?: number;
    name: string;
    slug: string;
    visibility: number;
    status: number;
    crated_at: Date;
    updated_at: Date;
    user: FolderUser;
    lists_count: number;
  }

  interface FolderUser {
    id: number;
    name: string;
    email: string;
    username: string;
    created_at: Date;
    updated_at: Date;
  }

  interface List {
    id: number;
    user_id: number;
    list_meta_id?: number;
    name: string;
    slug: string;
    visibility: number;
    status: number;
    crated_at: Date;
    updated_at: Date;
    user: ListUser;
    word_count: number;
  }

  interface ListUser {
    id: number;
    username: string;
    created_at: Date;
    updated_at: Date;
  }

  interface Meta {
    id: number;
    query: string;
    order_by: string;
    page: number;
    per_page: number;
    total: number;
    folder_id: number;
  }

  // data variables
  let currentPage = 1;
  let per_page = 20;
  let lists: List[] = [];
  let newLists: List[] = [];
  let meta: Meta;
  let folderMeta: Folder;
  let loading = false;
  let hasMore = true;
  let query: string = "";

  $: lists = [...lists, ...newLists];

  // fetch data
  async function fetchData() {
    loading = true;
    await axiosAPI
      .get(
        `/folders/${$page.params.id}?page=${currentPage}&per_page=${per_page}&query=${query}&order_by=asc`
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
          hasMore = true;
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
</script>

<main class="my-6">
  {#if folderMeta}
    <Heading tag="h2" class="my-10">{folderMeta.name}</Heading>
  {/if}

  {#if folderMeta}
    <div class="flex justify-between my-8">
      <a class="flex items-center space-x-4" href="/userprofile">
        <Avatar src={bot} size="sm" />
        <div class="space-y-1 font-medium dark:text-white">
          <div class="font-bold">{folderMeta.user.username}</div>
        </div>
      </a>
      <div class="font-bold">
        {#if u == null}
          <Button color="dark" href="/login">Login to save</Button>
        {:else if u && u.id == folderMeta.user_id}
          <Button color="dark">Edit</Button>
        {:else}
          <Button color="dark">Save</Button>
        {/if}
      </div>
    </div>
  {/if}

  {#if folderMeta}
    <Heading tag="h4" class="my-6"
      >{folderMeta.lists_count ?? 0}
      {folderMeta.lists_count > 1 ? "sets" : "set"} in this folder</Heading
    >
  {/if}

  {#each lists as set}
    <Card size="xl" href="/sets/{set.id}-{set.slug}" class="mb-3">
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        {set.name}
      </h5>
      <div class="flex justify-between mt-2">
        <a class="flex items-center space-x-4" href="/userprofile">
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
    <Heading tag="h5">Loading...&#128516;</Heading>
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
