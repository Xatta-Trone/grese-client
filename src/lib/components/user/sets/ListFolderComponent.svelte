<!-- @format -->
<script lang="ts">
  import SquareMinus from "$lib/icons/squareMinus.svelte";
  import SquarePlus from "$lib/icons/squarePlus.svelte";
  import type { Data, FoldersResponse } from "$lib/interfaces/folderListData";
  import type { Data as ListMeta } from "$lib/interfaces/setListData";

  import axiosAPI from "$lib/services/customAxios";
  import { Listgroup, ListgroupItem } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { inview } from "svelte-inview";

  export let listMeta: ListMeta;

  interface FolderInList {
    folders: number[];
  }

  // data variables
  let currentPage = 1;
  let per_page = 20;
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

  async function fetchListIds() {
    await axiosAPI
      .get(`/lists/${listMeta.id}/folders`)
      .then((res) => {
        const data: FolderInList = res.data;
        folderIds = [...data.folders];
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  onMount(() => {
    fetchData();
    fetchListIds();
  });

  function loadMore() {
    if (!hasMore) return;
    currentPage++;
    fetchData();
  }

  async function toggleFolder(id: number) {
    // /lists/:id/toggle-folder
    await axiosAPI
      .post(`/lists/${listMeta.id}/toggle-folder?folder_id=${id}`)
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
  <Listgroup active class="w-full">
    {#each sets as list}
      <ListgroupItem
        class="text-base font-semibold grid gap-6 grid-cols-10"
        on:click={() => {
          toggleFolder(list.id);
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

  <div use:inview={{}} on:change={loadMore} />
</div>
