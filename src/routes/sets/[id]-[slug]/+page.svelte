<!-- @format -->
<script lang="ts">
  import { page } from "$app/stores";
  import {
    Alert,
    Avatar,
    Badge,
    Button,
    Card,
    Heading,
    P,
    Select,
    TextPlaceholder,
    Toast,
  } from "flowbite-svelte";
  import type { PageData } from "./$types";
  import axiosAPI from "$lib/services/customAxios";
  import { onMount } from "svelte";
  import bot from "$lib/images/bot.png";
  import { inview } from "svelte-inview/dist/index";
  import type { LearningStatusGetResponse } from "$lib/interfaces/learningStatus";
  import { browser } from "$app/environment";
  import { INTENDED_KEY } from "$lib/utils/constants";
  import { redirectHelper } from "$lib/utils/helpers";
  import type {
    Word,
    ListMeta,
    Meta,
    SingleSetResponse,
  } from "$lib/interfaces/setData";
  import type { AxiosResponse } from "axios";
  import CloseIcon from "$lib/icons/closeIcon.svelte";
  import DevComponent from "$lib/components/DevComponent.svelte";
  import SetActionMenu from "$lib/components/user/sets/SetActionMenu.svelte";

  export let data: PageData;

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

  $: words = [...words, ...newWords];

  // fetch data
  async function fetchData() {
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
          words = [...words, ...data.words]
          hasMore = data.words.length < per_page ? false : true;
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

  onMount(() => {
    fetchData();
    if (data.user != null) {
      getLearningStatus();
    }
  });

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
          saveSuccess = "Successfully saved the set.";
        } else {
          saveError = "There was an error saving this set.";
        }
      })
      .catch((err) => {
        console.log(err.response);
        saveError = "Error saving the set.";
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
  </DevComponent>
  {#if listMeta}
    <Heading tag="h2" class="my-10">{listMeta.name}</Heading>
  {/if}

  {#if words.length > 0}
    <div class="grid md:grid-cols-4 gap-4 my-8 font-bold">
      <Button href="/sets/{listMeta.id}-{listMeta.slug}/flashcard" color="light"
        >Flash Cards</Button
      >
      <Button href="/sets/{listMeta.id}-{listMeta.slug}/practice" color="light"
        >Definition Match</Button
      >
      <Button
        href="/sets/{listMeta.id}-{listMeta.slug}/synonyms-practice"
        color="light">Synonyms Practice</Button
      >
      <Button
        href="/sets/{listMeta.id}-{listMeta.slug}/se-practice"
        color="light">SE Practice</Button
      >
    </div>
  {/if}

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
