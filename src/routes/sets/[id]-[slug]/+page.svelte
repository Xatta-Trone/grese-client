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
  import type { LearningStatusGetResponse } from "$lib/interfaces/learningStatus";
  import { unknown } from "zod";

  // export let data: PageData;

  console.log($page.params.id, $page.params.slug);

  let u: UserInterface | null;

  user.subscribe((value) => {
    u = value;
  });

  // interface
  interface SingleSetResponse {
    list_meta: ListMeta;
    meta: Meta;
    words: Word[];
  }

  interface ListMeta {
    id: number;
    user_id: number;
    list_meta_id: number;
    name: string;
    slug: string;
    visibility: number;
    status: number;
    crated_at: Date;
    updated_at: Date;
    user: User;
    word_count: number;
  }
  interface User {
    id: number;
    name: string;
    email: string;
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
    list_id: number;
  }

  interface Word {
    id: number;
    word: string;
    word_data: WordData;
    is_reviewed: number;
    created_at: Date;
    updated_at: Date;
  }

  interface WordData {
    word: string;
    partsOfSpeeches: PartsOfSpeech[];
  }

  interface PartsOfSpeech {
    partsOfSpeech: string;
    definitions: string[];
    examples: string[];
    synonyms_gre: string[];
    synonyms_normal: string[];
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

  $: words = [...words, ...newWords];

  // fetch data
  async function fetchData() {
    if (loading) return;
    loading = true;
    await axiosAPI
      .get(
        `/lists/${$page.params.slug}?page=${currentPage}&per_page=${per_page}&query=${query}&order_by=asc`
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
          newWords = data.words;
          hasMore = true;
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

    console.log($page.url.pathname);
    console.log($user);
    if ($user != null) {
      getLearningStatus();
    }
  });
</script>

<main class="my-6">
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
      <a class="flex items-center space-x-4" href="/userprofile">
        <Avatar src={bot} size="sm" />
        <div class="space-y-1 font-medium dark:text-white">
          <div class="font-bold">{listMeta.user.username}</div>
        </div>
      </a>
      <div class="font-bold">
        {#if u == null}
          <Button color="dark" href="/login">Login to save</Button>
        {:else if u && u.id == listMeta.user_id}
          <Button color="dark">Edit</Button>
        {:else}
          <Button color="dark">Save</Button>
        {/if}
      </div>
    </div>
  {/if}

  {#if listMeta}
    <Heading tag="h4" class="my-6"
      >{listMeta.word_count}
      {listMeta.word_count > 1 ? "words" : "word"} in this set</Heading
    >
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
            >{word.word_data.partsOfSpeeches ? word.word_data.partsOfSpeeches[0].partsOfSpeech : ''}</Badge
          >
        </P>
        <P>
          {word.word_data.partsOfSpeeches ? word.word_data.partsOfSpeeches[0].definitions[0] : '' }
        </P>
      </Card>
    {/each}
  {/if}

  <div use:inview={{}} on:change={loadMore} />

  {#if loading}
    <Heading tag="h5">Loading...&#128516;</Heading>
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
