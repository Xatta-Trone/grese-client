<!-- @format -->
<script lang="ts">
  import { page } from "$app/stores";
  import { user, type UserInterface } from "$lib/services/auth";
  import {
    ArrowKeyDown,
    ArrowKeyLeft,
    ArrowKeyRight,
    ArrowKeyUp,
    Avatar,
    Badge,
    Button,
    ButtonGroup,
    Card,
    Heading,
    Kbd,
    P,
    Toast,
    Toggle,
  } from "flowbite-svelte";
  import type { PageData } from "./$types";
  import axiosAPI from "$lib/services/customAxios";
  import { onMount } from "svelte";
  import bot from "$lib/images/bot.jpg";
  import { inview } from "svelte-inview/dist/index";
  import FlashCard from "$lib/components/FlashCard.svelte";
  import { flipped, showNonGre } from "$lib/services/flashcard";
  import { dev } from "$app/environment";

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
  let per_page = 50;
  let words: Word[] = [];
  let backupWords: Word[] = [];
  let newWords: Word[] = [];
  let listMeta: ListMeta;
  let meta: Meta;
  let loading = false;
  let hasMore = true;
  let query: string = "";

  $: words = [...words, ...newWords];

  // fetch data
  async function fetchData() {
    if (loading) return;
    loading = true;
    await axiosAPI
      .get(
        `/lists/${$page.params.slug}?page=${currentPage}&per_page=${per_page}&query=${query}`
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
          backupWords = [...backupWords, ...data.words];
          hasMore = data.words.length <= per_page ? true : false;
          // push to un-seen words

          data.words.forEach((element) => {
            notClickedWords = [...notClickedWords, element.id];
          });
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

  onMount(() => {
    fetchData();
    currentIndex = 0;
  });
  let showBack: boolean = false;
  let showNonGreWords: boolean = false;

  flipped.subscribe((val) => (showBack = val));

  function toggleShowBack() {
    flipped.set(!showBack);
  }
  showNonGre.subscribe((val) => (showNonGreWords = val));

  //   flashcard data
  let currentIndex: number = 0;
  function next() {
    loadMore();
    console.log(currentIndex);
    flipped.set(false);
    if (currentIndex < words.length - 1) {
      currentIndex++;
    } else {
      currentIndex = words.length - 1;
    }
  }

  function previous() {
    flipped.set(false);
    console.log(currentIndex >= 0);
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = 0;
    }
  }

  // up = 38
  // down = 40
  // right = 39
  // left = 37
  function onKeyDown(e: KeyboardEvent) {
    console.log(e, e.key == "Space");
    switch (e.key) {
      case "ArrowUp":
        toggleShowBack();
        break;
      case "ArrowDown":
        toggleShowBack();
        break;
      case "ArrowLeft":
        previous();
        break;
      case "ArrowRight":
        next();
        break;
      case "Enter":
        iKnowThisWord();
        break;
      case " ":
        iDoNotKnowThisWord();
        break;
    }
  }

  // known and unknown words
  let knownWords: number[] = [];
  let unknownWords: number[] = [];
  let masteredWords: number[] = [];
  let notClickedWords: number[] = [];

  function iKnowThisWord() {

    // check if all are mastered
    if(masteredWords.length == words.length) {
      console.log("All words mastered")
      return
    }

    const wordId = words[currentIndex].id;
    // remove from not clicked words
    // check in unknown words
    const notClickedWordsIndex = notClickedWords.indexOf(wordId);
    if (notClickedWordsIndex >= 0) {
      notClickedWords.splice(notClickedWordsIndex, 1);
      notClickedWords = [...notClickedWords];
    }

    // check in unknown words
    const unknownIndex = unknownWords.indexOf(wordId);

    if (unknownIndex != -1) {
      console.log("inside unknownIndex");
      // remove from unknown index
      unknownWords.splice(unknownIndex, 1);
      unknownWords = [...unknownWords];
    }

    // check in mastered words
    const masteredIndex = masteredWords.indexOf(wordId);

    if (masteredIndex != -1) {
      console.log("inside unknownIndex");
      // remove from unknown index
      knownWords.splice(unknownIndex, 1);
      knownWords = [...knownWords];
    }

    const index = knownWords.indexOf(wordId);


    if (index == -1) {
      // add to known set
      knownWords = [...knownWords, wordId];
      // remove from first
      // const removedWord: Word | undefined = words.shift();
      // // add to the last element
      // if (removedWord !== undefined) {
      //   newWords = [removedWord];
      // }
    } else {
      // found
      console.log(knownWords.indexOf(wordId));
      // add to mastered words
      masteredWords = [...masteredWords, knownWords[index]];
      // remove from known words
      knownWords.splice(index, 1);
      knownWords = [...knownWords];
      // words.shift();
      // words = [...words];
    }
    console.log(wordId, knownWords);
    // finally call the next word
    // next();
    determineNextIndex();
  }

  function iDoNotKnowThisWord() {
    const wordId = words[currentIndex].id;
    // remove from not clicked words
    // check in unknown words
    const notClickedWordsIndex = notClickedWords.indexOf(wordId);
    if (notClickedWordsIndex >= 0) {
      notClickedWords.splice(notClickedWordsIndex, 1);
      notClickedWords = [...notClickedWords];
    }

    // check in known words
    const knownIndex = knownWords.indexOf(wordId);

    if (knownIndex >= 0) {
      // remove from unknown index
      knownWords.splice(knownIndex, 1);
      knownWords = [...knownWords];
    }

    // check in known words
    const masteredIndex = masteredWords.indexOf(wordId);

    if (masteredIndex >= 0) {
      // remove from unknown index
      masteredWords.splice(masteredIndex, 1);
      masteredWords = [...masteredWords];
    }

    console.log(wordId, unknownWords);
    if (unknownWords.indexOf(wordId) == -1) {
      unknownWords = [...unknownWords, wordId];
    }

    // // add to the last element
    // const removedWord: Word | undefined = words.shift();
    // // add to the last element
    // if (removedWord !== undefined) {
    //   newWords = [removedWord];
    // }
    console.log(wordId, unknownWords);
    // finally call the next word
    // next();
    determineNextIndex();
  }

  function determineNextIndex() {
    console.log("not clicked words", notClickedWords)
    if (notClickedWords.length > 0) {
      // set the first word as next word
      const wordId = notClickedWords[0];

      // get the index from words
      const wordIndexInWordsArray = words.findIndex(
        (word) => word.id == wordId
      );

      // set the current index as it is
      currentIndex = wordIndexInWordsArray;
    } else {
      // merge the learning and not known words
      const newMergedArray = [...knownWords, ...unknownWords];
      console.log("new merged array",newMergedArray)

      if (newMergedArray.length > 0) {
        // set the first word as next word
        // select random item from the list
        const wordId = newMergedArray[(Math.floor(Math.random()*newMergedArray.length))];

        // get the index from words
        const wordIndexInWordsArray = words.findIndex(
          (word) => word.id == wordId
        );
        console.log("wordIndexInWordsArray",wordId,wordIndexInWordsArray,words)

        // set the current index as it is
        currentIndex = wordIndexInWordsArray;
      } else {
        console.log("Learned all the words")
      }
    }
  }
</script>

<main class="my-6">
  {#if dev}
    <!-- content here -->
    {words.length}
    {showBack}
    {currentIndex}
    {words.length}
    {hasMore}
    {backupWords.length}
    <p>Current index {currentIndex}</p>
    <p>
      Known {knownWords.length}
      {JSON.stringify(knownWords)}
    </p>
    <p>
      Unknown {unknownWords.length}
      {unknownWords}
    </p>
    <p>
      Mastered {masteredWords.length}
      {masteredWords}
    </p>
    <p>
      Not clicked {notClickedWords.length}
      {notClickedWords}
    </p>
  {/if}

  {#if listMeta}
    <!-- content here -->

    <!-- card count -->
    <div class="clear-both flex justify-center">
      <div class="inline-flex rounded-md shadow-sm">
        <div
          class="py-3 px-4 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
        >
          Mastered {masteredWords.length} / {listMeta.word_count}
        </div>
        <div
          class="py-3 px-4 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
        >
          Learning {knownWords.length} / {listMeta.word_count}
        </div>
        <div
          class="py-3 px-4 inline-flex justify-center items-center gap-2 -ml-px first:rounded-l-lg first:ml-0 last:rounded-r-lg border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
        >
          Unknown {unknownWords.length} / {listMeta.word_count}
        </div>
      </div>
    </div>
  {/if}

  {#if words.length > 0}
    {#key words[currentIndex].id}
      <FlashCard word={words[currentIndex]} />
    {/key}
  {/if}

  <div class="my-2 flex justify-center">
    <ButtonGroup>
      <Button on:click={iKnowThisWord} color="green">
        I know this word
        <Kbd class="inline-flex items-center px-2 py-1.5 ml-1">Enter</Kbd>
      </Button>
      <Button on:click={iDoNotKnowThisWord} color="red">
        I don't know this word
        <Kbd class="inline-flex items-center px-2 py-1.5 ml-1">Space</Kbd>
      </Button>
    </ButtonGroup>
  </div>

  <div class="clear-both flex justify-center">
    <ButtonGroup outline>
      <Button on:click={previous}>
        <Kbd class="inline-flex items-center mr-1 px-2 py-1.5">
          <ArrowKeyLeft />
        </Kbd>
        Previous word
      </Button>
      <Button on:click={toggleShowBack}>
        Flip card
        <Kbd class="inline-flex items-center px-2 py-1.5 ml-1"
          ><ArrowKeyUp /> <ArrowKeyDown /></Kbd
        >
      </Button>
      <Button on:click={next}>
        Next word
        <Kbd class="inline-flex items-center ml-1 px-2 py-1.5">
          <ArrowKeyRight />
        </Kbd>
      </Button>
    </ButtonGroup>
  </div>
</main>
<svelte:window on:keydown|preventDefault={onKeyDown} />
