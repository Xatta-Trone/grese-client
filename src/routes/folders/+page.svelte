<!-- @format -->
<script lang="ts">
  import bot from "$lib/images/bot.png";
  import type { Data, FoldersResponse } from "$lib/interfaces/folderListData";
  import axiosAPI from "$lib/services/customAxios";
  import { Avatar, Card, Heading, Input, Skeleton } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { inview } from "svelte-inview/dist/index";
  import { fade } from "svelte/transition";

  // data variables
  let currentPage = 1;
  let per_page = 20;
  let sets: Data[] = [];
  let newSets: Data[] = [];
  let loading = false;
  let hasMore = true;
  let query: string = "";

  $: sets = [...sets, ...newSets];

  //   export let data: PageData;

  async function fetchData() {
    if (loading) return;
    loading = true;
    await axiosAPI
      .get(
        `/public-folders?page=${currentPage}&per_page=${per_page}&query=${query}`
      )
      .then((res) => {
        const data: FoldersResponse = res.data;
        // console.log(data);

        if (data.data.length) {
          newSets = data.data;
          hasMore = data.data.length <= per_page ? true : false;
        } else {
          hasMore = false;
        }
      })
      .finally(() => (loading = false));
  }

  function loadMore() {
    if (loading || !hasMore) return;
    currentPage++;
    fetchData();
  }

  let timer: ReturnType<typeof setTimeout>;

  const debounce = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      await reset();
      replaceStateWithQuery({ query: query });
      fetchData();
    }, 500);
  };

  const replaceStateWithQuery = (values: Record<string, string>) => {
    const url = new URL(window.location.toString());
    for (let [k, v] of Object.entries(values)) {
      if (!!v) {
        url.searchParams.set(k, v);
      } else {
        url.searchParams.delete(k);
      }
    }
    history.replaceState(history.state, "", url);
  };

  async function reset() {
    currentPage = 1;
    sets = [];
    newSets = [];
    loading = false;
    hasMore = true;
  }

  onMount(() => {
    const url = new URL(window.location.toString());
    const q = url.searchParams.get("query");

    if (q != null) {
      query = q;
    }

    fetchData();
  });
</script>

<svelte:head>
  <title>Available Set Folders</title>
</svelte:head>

<main class="my-6" in:fade>
  <div class="my-3">
    <Heading tag="h4">Available Set Folders</Heading>
  </div>
  <div class="mb-6">
    <Input
      id="large-input"
      size="md"
      placeholder="Type to search...."
      bind:value={query}
      on:keyup={debounce}
    />
  </div>

  {#each sets as set}
    <Card size="xl" href="/folders/{set.id}-{set.slug}" class="mb-3">
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        {set.name}
      </h5>
      <div class="flex justify-between mt-2">
        <a class="flex items-center space-x-4" href="/@{set.user?.username}?tab=folders">
          <Avatar src={bot} size="xs" />
          <div class="space-y-1 font-medium dark:text-white">
            <div>{set.user?.username}</div>
          </div>
        </a>
        <div>{set.lists_count ?? 0} {set.lists_count > 1 ? "sets" : "set"}</div>
      </div>
    </Card>
  {/each}

  <div use:inview={{}} on:change={loadMore} />

  {#if loading}
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
  {/if}

  {#if sets.length == 0 && !hasMore && !loading}
    <Heading tag="h5">Nothing found. &#128532;</Heading>
  {/if}

  {#if sets.length > 0 && !hasMore}
    <Heading tag="h6" color="text-gray-600 dark:text-white"
      >End of results &#128522;</Heading
    >
  {/if}
</main>
