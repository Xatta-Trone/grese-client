<!-- @format -->
<script lang="ts">
  import { page } from "$app/stores";
  import DevComponent from "$lib/components/DevComponent.svelte";
  import FlashCard from "$lib/components/FlashCard.svelte";
  import type { LearningStatusGetResponse } from "$lib/interfaces/learningStatus";
  import {
    LearningState,
    type ListMeta,
    type Meta,
    type SingleSetResponse,
    type Word,
  } from "$lib/interfaces/setData";
  import axiosAPI from "$lib/services/customAxios";
  import { flipped, showNonGre } from "$lib/services/flashcard";
  import {
    ArrowKeyDown,
    ArrowKeyLeft,
    ArrowKeyRight,
    ArrowKeyUp,
    Button,
    ButtonGroup,
    Heading,
    Kbd,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
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
  let learningStatusCount: LearningStatusGetResponse;

  // known and unknown words
  let knownWords: number[] = [];
  let unknownWords: number[] = [];
  let masteredWords: number[] = [];
  let notClickedWords: number[] = [];

  $: words = [...words, ...newWords];

  // fetch data
  async function fetchData() {
    if (loading) return;
    loading = true;
    await axiosAPI
      .get(
        `/lists/${$page.params.id}?page=${currentPage}&per_page=${per_page}&query=${query}&order_by=asc`
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

  async function getLearningStatus() {
    await axiosAPI
      .get(`/learning-status/${$page.params.id}`)
      .then((res) => {
        learningStatusCount = res.data;
        console.log(learningStatusCount);
        masteredWords = [...learningStatusCount.mastered];
        knownWords = [...learningStatusCount.learning];
        unknownWords = [...learningStatusCount.unknown];
      })
      .catch((err) => {
        console.log(err);
        // masteredWords = [];
        // knownWords = [];
        // unknownWords = [];
      });
  }

  onMount(() => {
    fetchData();
    currentIndex = 0;
    getLearningStatus();
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

  function iKnowThisWord() {
    // check if all are mastered
    if (masteredWords.length == words.length) {
      console.log("All words mastered");
      return;
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
      updateWordStatus(wordId, LearningState.LEARNING);
    }

    // check in mastered words
    const masteredIndex = masteredWords.indexOf(wordId);

    if (masteredIndex != -1) {
      console.log("this word is mastered");
      // remove from unknown index
      knownWords.splice(unknownIndex, 1);
      knownWords = [...knownWords];
      updateWordStatus(wordId, LearningState.LEARNING);
    }

    const index = knownWords.indexOf(wordId);

    if (index == -1) {
      // add to known set
      knownWords = [...knownWords, wordId];
      updateWordStatus(wordId, LearningState.LEARNING);
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
      updateWordStatus(wordId, LearningState.MASTERED);
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
    updateWordStatus(wordId, LearningState.UNKOWN);
    determineNextIndex();
  }

  function determineNextIndex() {
    console.log("not clicked words", notClickedWords);
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
      console.log("new merged array", newMergedArray);

      if (newMergedArray.length > 0) {
        // set the first word as next word
        // select random item from the list
        const wordId =
          newMergedArray[Math.floor(Math.random() * newMergedArray.length)];

        // get the index from words
        const wordIndexInWordsArray = words.findIndex(
          (word) => word.id == wordId
        );
        console.log(
          "wordIndexInWordsArray",
          wordId,
          wordIndexInWordsArray,
          words
        );

        // set the current index as it is
        currentIndex = wordIndexInWordsArray;
      } else {
        console.log("Learned all the words");
      }
    }
  }

  function updateWordStatus(wordId: number, state: LearningState) {
    const formData = {
      list_id: listMeta.id,
      word_id: wordId,
      learning_state: state,
      user_id: data.user?.id ?? 0,
    };

    axiosAPI
      .post("learning-status", formData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getWordLearningState(wordId: number): LearningState {
    if (masteredWords.indexOf(wordId) != -1) {
      return LearningState.MASTERED;
    }

    if (knownWords.indexOf(wordId) != -1) {
      return LearningState.LEARNING;
    }

    return LearningState.UNKOWN;
  }
</script>

<svelte:head>
  <title>{listMeta ? `Flash Cards: ${listMeta.name}` : "Flash Cards"}</title>
</svelte:head>

<main class="my-6">
  <DevComponent>
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
  </DevComponent>

  {#if !loading || words.length > 0}
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
        <FlashCard
          word={words[currentIndex]}
          {currentIndex}
          learningState={getWordLearningState(words[currentIndex].id)}
        />
      {/key}

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
    {/if}
  {:else if loading && words.length == 0}
    <Heading tag="h5">Loading...&#128516;</Heading>
  {/if}
</main>
<svelte:window on:keydown|preventDefault={onKeyDown} />
