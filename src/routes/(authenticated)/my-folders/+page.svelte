<!-- @format -->
<script lang="ts">
  import FolderActionMenu from "$lib/components/user/folders/FolderActionMenu.svelte";
  import bot from "$lib/images/bot.png";
  import type { Data, FoldersResponse } from "$lib/interfaces/folderListData";
  import axiosAPI from "$lib/services/customAxios";
  import { Avatar, Badge, Card, Heading, Input, Select, Skeleton } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { inview } from "svelte-inview/dist/index";
  import type { PageData } from "./$types";

  export let data: PageData;
  // interfaces

  // data variables
  let currentPage = 1;
  let per_page = 20;
  let sets: Data[] = [];
  let loading = false;
  let hasMore = true;
  let query: string = "";
  let filter = "all";
  let filters = [
    { value: "all", name: "Everything" },
    { value: "created", name: "Created" },
    { value: "saved", name: "Saved" },
  ];

  //   export let data: PageData;

  async function fetchData() {
    loading = true;
    await axiosAPI
      .get(
        `/folders?page=${currentPage}&per_page=${per_page}&query=${query}&filter=${filter}&save_order=asc&order_by=id&order=desc`
      )
      .then((res) => {
        const data: FoldersResponse = res.data;
        // console.log(data);

        if (data.data.length) {
          sets = [...sets, ...data.data];
          hasMore = data.data.length < per_page ? false : true;
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

  // handle deleted action
  function handleDeletedAction(event: CustomEvent<Data>) {
    console.log(event.detail);
    sets = [...sets.filter((set) => set.id != event.detail.id)];
  }
</script>

<svelte:head>
  <title>My folders: GRE SE</title>
</svelte:head>

<main>
  <div class="my-3">
    <Heading tag="h4">My folders</Heading>
  </div>
  <div class="grid gap-6 mb-6 md:grid-cols-10">
    <div class="col-span-8">
      <Input
        id="large-input"
        size="md"
        placeholder="Type to search...."
        bind:value={query}
        on:keyup={debounce}
      />
    </div>
    <div class="col-span-2">
      <Select
        placeholder="Filter..."
        on:change={changeFilter}
        size="md"
        items={filters}
        bind:value={filter}
      />
    </div>
  </div>

  {#each sets as set}
    <Card size="xl" class="mb-3">
      <div class="flex justify-between items-start">
        <a class="inline-block" href="/folders/{set.id}-{set.slug}">
          <Heading tag="h4">
            {set.name}
            {#if set.user_id == data.user?.id}
              <Badge>{set.visibility == 1 ? "Public" : "Private"}</Badge>
            {/if}
          </Heading>
        </a>

        <div>
          <FolderActionMenu
            on:deleted={handleDeletedAction}
            folderMetaData={set}
            isOwner={set.user_id == data.user?.id}
          />
        </div>
      </div>

      <div class="flex justify-between mt-2">
        <a class="flex items-center space-x-4" href="/@{set.user?.username}">
          <Avatar src={bot} size="sm" />
          <div class="space-y-1 font-medium dark:text-white">
            <div>{set.user?.username}</div>
          </div>
        </a>
        <div>{set.lists_count} {set.lists_count > 1 ? "sets" : "set"}</div>
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
