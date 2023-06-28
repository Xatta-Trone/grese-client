<!-- @format -->
<script lang="ts">
  import SquareMinus from "$lib/icons/squareMinus.svelte";
  import SquarePlus from "$lib/icons/squarePlus.svelte";
  import type { Folder } from "$lib/interfaces/folderResponse";
  import type { Data, SetsResponse } from "$lib/interfaces/setListData";
  import axiosAPI from "$lib/services/customAxios";
  import { Button, Listgroup, ListgroupItem } from "flowbite-svelte";
  import { onMount } from "svelte";

  export let folderMeta: Folder;

  interface ListsInfolder {
    lists: number[];
  }

  // data variables
  let currentPage = 1;
  let per_page = 50;
  let sets: Data[] = [];
  let folderIds: number[] = [];
  let loading = false;
  let hasMore = true;
  let query: string = "";
  let filter = "all";

  // fetch data
  async function fetchData() {
    if (loading || !hasMore) return;
    loading = true;
    await axiosAPI
      .get(
        `/lists?page=${currentPage}&per_page=${per_page}&query=${query}&filter=${filter}&save_order=asc&order_by=id&order=desc`
      )
      .then((res) => {
        const data: SetsResponse = res.data;
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
    loadMore()
  }

  async function fetchFolderIds() {
    await axiosAPI
      .get(`/folders/${folderMeta.id}/lists`)
      .then((res) => {
        const data: ListsInfolder = res.data;
        folderIds = [...data.lists];
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  onMount(() => {
    fetchData();
    fetchFolderIds();
  });

  function loadMore() {
    if (!hasMore) return;
    currentPage++;
    fetchData();
  }

  async function toggleList(id: number) {
    // /folders/:id/toggle-list
    await axiosAPI
      .post(`/folders/${folderMeta.id}/toggle-list?list_id=${id}`)
      .then((res) => {
        if (folderIds.includes(id)) {
          folderIds = [...folderIds.filter((i) => i != id)];
        } else {
          folderIds = [...folderIds, id];
        }
      })
      .catch((err) => {
        alert(err.response?.data.errors);
        console.log(err.response);
      });
  }
</script>

<div>
  <div class="w-100 mb-4">
    <Button color="dark" href="/create/sets?folder={folderMeta?.id}">Create a new set</Button>
  </div>
  <Listgroup active class="w-full">
    {#each sets as list}
      <ListgroupItem
        class="text-base font-semibold grid gap-6 grid-cols-10"
        on:click={() => {
          toggleList(list.id);
        }}
      >
        <div class="col-span-9">
          {list.name}
        </div>
        <div class="col-span-1">
          {#if folderIds.includes(list.id)}
            <SquareMinus size="18" defaultClass="text-red-600" />
          {:else}
            <SquarePlus size="18" defaultClass="text-green-600" />
          {/if}
        </div>
      </ListgroupItem>
    {/each}
  </Listgroup>

  <!-- <div use:inview={{}} on:change={loadMore} /> -->
</div>
