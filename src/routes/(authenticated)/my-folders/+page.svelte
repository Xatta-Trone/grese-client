<!-- @format -->
<script lang="ts">
  import axiosAPI from "$lib/services/customAxios";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { inview } from "svelte-inview/dist/index";
  import { Avatar, Card, Heading, Input, Label, Select } from "flowbite-svelte";
  import { page } from "$app/stores";
  import bot from "$lib/images/bot.png";

  // interfaces
  interface FoldersResponse {
    data: Data[];
    meta: Meta;
  }

  interface Data {
    id: number;
    user_id: number;
    list_meta_id?: number;
    name: string;
    slug: string;
    visibility: number;
    status: number;
    crated_at: Date;
    updated_at: Date;
    user: User;
    lists_count: number;
  }

  interface User {
    id: number;
    username: string;
    created_at: Date;
    updated_at: Date;
  }

  interface Meta {
    id: number;
    query: string;
    order_by: string;
    order: string;
    page: number;
    per_page: number;
    user_id: number;
    count: number;
    filter: string;
  }

  // data variables
  let currentPage = 1;
  let per_page = 20;
  let sets: Data[] = [];
  let newSets: Data[] = [];
  let loading = false;
  let hasMore = true;
  let query: string = "";
  let filter = "all";
  let filters = [
    { value: "all", name: "Everything" },
    { value: "created", name: "Created" },
    { value: "saved", name: "Saved" },
  ];

  $: sets = [...sets, ...newSets];

  //   export let data: PageData;

  async function fetchData() {
    loading = true;
    await axiosAPI
      .get(
        `/folders?page=${currentPage}&per_page=${per_page}&query=${query}&filter=${filter}&order=desc&order_by=id`
      )
      .then((res) => {
        const data: FoldersResponse = res.data;
        // console.log(data);

        if (data.data.length) {
          newSets = data.data;
          hasMore = true;
        } else {
          hasMore = false;
        }
      })
      .catch((error) => {
        alert(JSON.stringify(error.response.data.errors));
      })
      .finally(() => (loading = false));
  }

  function loadMore() {
    if (!hasMore) return;
    currentPage++;
    fetchData();
  }
  async function changeFilter() {
    await reset();
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

<main>
  <div class="my-3">
    <Heading tag="h4">My folders</Heading>
  </div>
  <div class="grid gap-6 mb-6 md:grid-cols-10">
    <div class="col-span-8">
      <Input
        id="large-input"
        size="lg"
        placeholder="Type to search...."
        bind:value={query}
        on:keyup={debounce}
      />
    </div>
    <div class="col-span-2">
      <Select
        placeholder="Filter..."
        on:change={changeFilter}
        size="lg"
        items={filters}
        bind:value={filter}
      />
    </div>
  </div>

  {#each sets as set}
    <Card size="xl" href="/folders/{set.id}-{set.slug}" class="mb-3">
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        {set.name}
      </h5>
      <div class="flex justify-between mt-2">
        <a class="flex items-center space-x-4" href="/userprofile">
          <Avatar src={bot} size="sm" />
          <div class="space-y-1 font-medium dark:text-white">
            <div>{set.user.username}</div>
          </div>
        </a>
        <div>{set.lists_count} {set.lists_count > 1 ? "sets" : "set"}</div>
      </div>
    </Card>
  {/each}

  <div use:inview={{}} on:change={loadMore} />

  {#if loading}
    <Heading tag="h5">Loading...&#128516;</Heading>
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
