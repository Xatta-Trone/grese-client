<!-- @format -->
<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import DevComponent from "$lib/components/DevComponent.svelte";
  import SetActionMenu from "$lib/components/user/sets/SetActionMenu.svelte";
  import CloseIcon from "$lib/icons/closeIcon.svelte";
  import bot from "$lib/images/bot.png";
  import type { BadStatusErrorResponse } from "$lib/interfaces/common";
  import type { LearningStatusGetResponse } from "$lib/interfaces/learningStatus";
  import type {
    ListMeta,
    Meta,
    SingleSetResponse,
    Word,
  } from "$lib/interfaces/setData";
  import axiosAPI from "$lib/services/customAxios";
  import { INTENDED_KEY } from "$lib/utils/constants";
  import { redirectHelper } from "$lib/utils/helpers";
  import type { AxiosError, AxiosResponse } from "axios";
  import {
    Alert,
    Avatar,
    Badge,
    Button,
    Card,
    Heading,
    Mark,
    P,
    Select,
    TextPlaceholder,
  } from "flowbite-svelte";
  import { afterUpdate, onMount } from "svelte";
  import { inview } from "svelte-inview/dist/index";
  import type { PageData } from "./$types";

  export let data: PageData;

  interface SaveListIDSResponse {
    data: number[];
  }

  // data variables
  let currentPage = 1;
  let per_page = 20;
  let words: Word[] = [];
  let newWords: Word[] = [];
  let listMeta: ListMeta;
  let meta: Meta;
  let loading = false;
  let hasMore = true;
  let query: string = "";
  let learningStatusCount: LearningStatusGetResponse;
  let orderBy = "id";
  let orderDir = "asc";
  let errorMessage: string | null = null;
  let savedLists: number[] = [];

  $: words = [...words, ...newWords];

  // fetch data
  async function fetchData() {
    errorMessage = null;
    if (loading) return;
    loading = true;
    await axiosAPI
      .get(
        `/lists/${$page.params.id}?page=${currentPage}&per_page=${per_page}&query=${query}&order_by=${orderDir}&order=${orderBy}`
      )
      .then((res) => {
        const data: SingleSetResponse = res.data;
        // console.log(data);
        if (meta == undefined) {
          meta = data.meta;
        }

        if (listMeta == undefined) {
          listMeta = data.list_meta;
        }

        if (data.words.length) {
          words = [...words, ...data.words];
          hasMore = data.words.length < per_page ? false : true;
        } else {
          hasMore = false;
        }
      })
      .catch((err: AxiosError) => {
        console.log(err.response?.data);
        const e: BadStatusErrorResponse | any = err.response?.data;

        errorMessage = e.errors;
      })
      .finally(() => (loading = false));
  }

  function loadMore() {
    if (loading || !hasMore) return;
    currentPage++;
    fetchData();
  }

  async function getLearningStatus() {
    await axiosAPI
      .get(`/learning-status/${$page.params.id}`)
      .then((res) => {
        learningStatusCount = res.data;
        console.log(learningStatusCount);
      })
      .catch((err) => {
        console.log(err);
        learningStatusCount.learning = [];
        learningStatusCount.mastered = [];
        learningStatusCount.unknown = [];
      });
  }

  async function savedListIds() {
    await axiosAPI
      .get(`/saved-list-ids`)
      .then((res: AxiosResponse) => {
        const listIds: SaveListIDSResponse = res.data;
        savedLists = [...listIds.data];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onMount(() => {
    saveError = null;
    saveSuccess = null;
    if ($page.url.searchParams.get("forbidden")) {
      $page.url.searchParams.delete("forbidden")
      saveError = "You do not have permission to view that page";
    }

    fetchData();
    if (data.user != null) {
      getLearningStatus();
      savedListIds();
    }
  });

  afterUpdate(() => {
    saveError = null
     if ($page.url.searchParams.get("forbidden")) {
      saveError = "You do not have permission to view that page";
      $page.url.searchParams.delete("forbidden")
    }
  })

  function handleLoginToSave() {
    if (browser) {
      localStorage.setItem(INTENDED_KEY, $page.url.pathname + $page.url.search);
      // goto("/login");
    }

    redirectHelper("/login");
  }

  // =========================
  // sorting
  // =========================

  let selected: string = "default";
  let filters = [
    { value: "default", name: "Default" },
    { value: "az", name: "A-Z" },
    { value: "za", name: "Z-A" },
  ];

  function handleFilter() {
    //   let orderBy = "id";
    // let orderDir = "asc";
    switch (selected) {
      case "az":
        orderBy = "word";
        orderDir = "asc";
        break;
      case "za":
        orderBy = "word";
        orderDir = "desc";
        break;

      default:
        orderBy = "id";
        orderDir = "desc";
        break;
    }

    // set page 1
    currentPage = 1;
    words = [];
    newWords = [];
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
    saveSuccess = null;
    saveError = null;
    saving = true;
    console.log("handle save");

    if (data.user == null) {
      redirectHelper("/login", $page.url);
      return;
    }

    // continue to save
    const postData = {
      user_id: data.user.id,
      list_id: listMeta.id,
      scope: "user",
    };

    axiosAPI
      .post("/saved-lists", postData)
      .then((res: AxiosResponse) => {
        if (res.status == 201) {
          savedLists = [...savedLists,listMeta.id]
          saveSuccess = "Successfully saved the set.";
        } else {
          saveError = "There was an error saving this set.";
        }
      })
      .catch((err) => {
        console.log(err.response);
        saveError = err.response.data.errors ?? "Error saving the set.";
      })
      .finally(() => {
        saving = false;
      });
  }
</script>

<svelte:head>
  <title>{listMeta ? listMeta.name : "Set details"}</title>
</svelte:head>

<main class="my-6">
  <DevComponent>
    {words.length}
    {JSON.stringify(listMeta)}
    
      <P>
        Includes: {JSON.stringify(savedLists)} {savedLists.includes(listMeta?.id)}
      </P>
   
    <P>
      <!-- {data.user != null && data.user.expires_on == null && listMeta != undefined && savedLists.includes(listMeta.id) == false} -->
    </P>
  </DevComponent>
  {#if listMeta}
    <Heading tag="h2" class="my-10">{listMeta.name}</Heading>
  {/if}

  {#if errorMessage}
    <Alert color="red">
      <span class="font-medium">
        {errorMessage}
      </span>
    </Alert>
  {/if}

  <div class="relative">
    {#if data.user != null && data.user?.expires_on == null && (listMeta != undefined && !savedLists.includes(listMeta.id))}
      <div
        class="absolute w-full h-full bg-slate-600 bg-opacity-30 text-4xl text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <Mark>Please save first to explore</Mark>
      </div>
    {/if}

    {#if words.length > 0}
      <div class="grid md:grid-cols-4 gap-4 my-8 font-bold">
        <Button
          href="/sets/{listMeta.id}-{listMeta.slug}/flashcard"
          color="light">Flash Cards</Button
        >
        <Button
          href="/sets/{listMeta.id}-{listMeta.slug}/practice"
          color="light">Definition Match</Button
        >
        <Button
          href="/sets/{listMeta.id}-{listMeta.slug}/synonyms-practice"
          color="light">Synonyms Practice</Button
        >
        <Button
          data-sveltekit-preload-data="none"
          href="/sets/{listMeta.id}-{listMeta.slug}/se-practice"
          color="light">SE Practice <Badge class="ml-2">Plus</Badge></Button
        >
      </div>
    {/if}
  </div>

  {#if listMeta}
    <div class="flex justify-between my-8">
      <a class="flex items-center space-x-4" href="/@{listMeta.user.username}">
        <Avatar src={bot} size="sm" />
        <div class="space-y-1 font-medium dark:text-white">
          <div class="font-bold">{listMeta.user.username}</div>
        </div>
      </a>
      <div class="font-bold">
        {#if data.user == null}
          <Button color="dark" on:click={handleLoginToSave}
            >Login to save</Button
          >
        {:else if data.user?.id == listMeta.user_id}
          <SetActionMenu
            setMetaData={listMeta}
            isOwner={listMeta.user_id == data.user?.id}
          />
        {:else}
          <Button color="dark" on:click={handleSave} disabled={saving}
            >Save</Button
          >
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

  {#if listMeta}
    <div class="flex flex-col md:flex-row items-center">
      <Heading tag="h4" class="my-3"
        >{listMeta.word_count}
        {listMeta.word_count > 1 ? "words" : "word"} in this set</Heading
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

  {#if learningStatusCount && listMeta}
    <div class="grid md:grid-cols-3 gap-4 my-8 font-bold cursor-default">
      <Button color="alternative">
        Mastered: {learningStatusCount.mastered.length}
      </Button>
      <Button color="alternative"
        >Learning: {learningStatusCount.learning.length}
      </Button>
      <Button color="alternative"
        >Not studied: {learningStatusCount.unknown.length}
      </Button>
    </div>
  {/if}

  {#if words.length > 0}
    {#each words as word}
      <Card size="xl">
        <P>
          <span class="font-bold capitalize">{word.word}</span>
          <Badge color="dark" large
            >{word.word_data.partsOfSpeeches
              ? word.word_data.partsOfSpeeches[0].partsOfSpeech
              : ""}</Badge
          >
        </P>
        <P>
          {word.word_data.partsOfSpeeches
            ? word.word_data.partsOfSpeeches[0].definitions[0]
            : ""}
        </P>
      </Card>
    {/each}
  {/if}

  <div use:inview={{}} on:change={loadMore} />

  {#if loading}
    {#each Array(10) as _, index (index)}
      <TextPlaceholder size="xxl" class="mt-8" />
    {/each}
  {/if}

  {#if words.length == 0 && !hasMore && !loading}
    <Heading tag="h5">Nothing found. &#128532;</Heading>
  {/if}

  {#if words.length > 0 && !hasMore}
    <Heading tag="h6" color="text-gray-600 dark:text-white mt-5"
      >End of results &#128522;</Heading
    >
  {/if}
</main>
