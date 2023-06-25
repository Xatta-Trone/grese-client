<!-- @format -->
<script lang="ts">
  import { page } from "$app/stores";
  import DevComponent from "$lib/components/DevComponent.svelte";
  import SettingsIcon from "$lib/icons/settingsIcon.svelte";
  import type {
    ListMeta,
    Meta,
    SingleSetResponse,
    Word,
  } from "$lib/interfaces/setData";
  import axiosAPI from "$lib/services/customAxios";
  import {
    Button,
    ButtonGroup,
    Heading,
    Modal,
    P,
    Toggle,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  // export let data: PageData;

  interface SynonymsQuestion {
    wordId: number;
    question: string;
    correctAns: string[];
    selectedAns: string[];
    options: string[];
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
    if (loading || !hasMore) return;
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
          // to prevent the errors occurring from null parts of speech
          const filteredWords = data.words.filter(
            (word) => word.word_data.partsOfSpeeches != null
          );
          words = [...words, ...filteredWords];
          // newWords = filteredWords;
          backupWords = [...backupWords, ...filteredWords];
          totalQuestion = backupWords.length;
          questionRemaining = backupWords.length;
          hasMore = data.words.length >= per_page ? true : false;
        } else {
          hasMore = false;
        }
      })
      .finally(() => {
        loading = false;
        // call for next
        return loadMore();
      });
  }

  function loadMore() {
    if (loading || !hasMore) return;
    currentPage++;
    fetchData();
  }

  onMount(async () => {
    await fetchData();
    currentIndex = 0;
    buildQuestion();
  });

  let currentIndex: number = 0;
  let isRandom: boolean = false;
  let completedQuiz: boolean = false;
  let totalQuestion: number = 0;
  let questionRemaining: number = 0;
  let correctQuestion: number = 0;
  let synonymsQuestion: SynonymsQuestion | null = null;

  function buildQuestion() {
    if (synonymsQuestion != null) {
      // remove the current element
      words.splice(
        words.findIndex((word) => word.id == synonymsQuestion?.wordId),
        1
      );
      words = [...words]; // reactivity
    }

    // check remaining questions
    if (questionRemaining <= 0) {
      completedQuiz = true;
      return;
    }

    // first set the current index
    if (isRandom) {
      currentIndex = Math.floor(Math.random() * words.length);
    } else if (words.length > 0) {
      currentIndex = 0;
    } else {
      currentIndex = -1;
      completedQuiz = true;
    }

    // now build the question
    // get the word model of this current index
    if (currentIndex >= 0) {
      const word: Word = words[currentIndex];
      // create empty question instance
      const questionToPopulate: SynonymsQuestion = {
        wordId: 0,
        question: "",
        selectedAns: [],
        correctAns: [],
        options: [],
      };

      // populate the question
      questionToPopulate.wordId = word.id;
      questionToPopulate.question = word.word;

      // get all the synonyms
      let tempSynonyms: string[] = [];

      if (word.word_data.partsOfSpeeches == null) {
        buildQuestion();
        return;
      }

      word.word_data.partsOfSpeeches.forEach((pos) => {
        // tempSynonyms = [...tempSynonyms, ...pos.synonyms_gre];
        tempSynonyms.push(...pos.synonyms_gre);
      });

      // check if gre synonyms is empty or less than 3
      if (tempSynonyms.length < 3) {
        buildQuestion();
        return;
      }

      //  choose the correct answers
      const MIN_ANS_SIZE = 1;
      const MAX_ANS_SIZE = tempSynonyms.length < 4 ? tempSynonyms.length : 4;
      const numberOfCorrectAns: number = Math.floor(
        Math.random() * (MAX_ANS_SIZE - MIN_ANS_SIZE + 1) + MIN_ANS_SIZE
      );
      const correctAns: string[] = getMultipleRandom(
        tempSynonyms,
        numberOfCorrectAns
      );

      //   set the correct ans array
      questionToPopulate.correctAns = [...correctAns];

      // now add additional answers
      const additionalAns = buildAdditionalAnswer(
        word.id,
        questionToPopulate.correctAns
      );
      console.log(additionalAns);
      questionToPopulate.options = [...additionalAns];
      // randomize the array
      questionToPopulate.options = shuffle(questionToPopulate.options);

      synonymsQuestion = questionToPopulate;
      //   reset the state
      showNextQuestionButton = false;
      showCorrectAns = false;
    }
  }

  function getMultipleRandom(arr: string[], num: number) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  }

  function buildAdditionalAnswer(
    wordId: number,
    correctAns: string[]
  ): string[] {
    let additionalAns: string[] = [...correctAns];
    const totalOption: number = 6;

    while (additionalAns.length < totalOption) {
      // find random definition
      let randomWord: Word =
        backupWords[Math.floor(Math.random() * backupWords.length)];

      let tempSynonyms: string[] = [];

      if (randomWord.word_data.partsOfSpeeches == null) {
        continue;
      }

      randomWord.word_data.partsOfSpeeches.forEach((pos) => {
        tempSynonyms = [...tempSynonyms, ...pos.synonyms_gre];
      });

      if (
        randomWord.id == wordId ||
        additionalAns.some((ans) => tempSynonyms.includes(ans))
      ) {
        continue;
      } else {
        // get a radom synonym
        const randomSynonymIndex = Math.floor(
          Math.random() * tempSynonyms.length
        );
        additionalAns.push(tempSynonyms[randomSynonymIndex]);

        additionalAns = [
          ...additionalAns.filter((el) => el != null || el != undefined),
        ];
      }
    }

    return additionalAns;
  }

  function shuffle(array: string[]): string[] {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  function resetQuiz() {
    if (listMeta) {
      // set the total question
      synonymsQuestion = null;
      completedQuiz = false;
      questionRemaining = totalQuestion;
      correctQuestion = 0;
      words = [...backupWords];
      currentIndex = 0;
      buildQuestion();
    } else {
      alert("There was an error");
    }
  }

  // modal
  let clickOutsideModal = false;
  function toggleRandom() {
    isRandom = !isRandom;
  }

  function handleQuestionRemainingInc() {
    const val = questionRemaining ?? 0;

    if (questionRemaining >= backupWords.length) {
      totalQuestion = backupWords.length;
      questionRemaining = totalQuestion;
    } else {
      totalQuestion = totalQuestion + 1;
      questionRemaining = totalQuestion;
    }
  }

  function handleQuestionRemainingDec() {
    const val = questionRemaining ?? 0;

    if (questionRemaining <= 2) {
      totalQuestion = 2;
      questionRemaining = totalQuestion;
    } else {
      totalQuestion = totalQuestion - 1;
      questionRemaining = totalQuestion;
    }
  }

  let showCorrectAns: boolean = false;
  let showNextQuestionButton: boolean = false;

  function setSynAns(option: string) {
    // index
    const index = synonymsQuestion?.selectedAns.findIndex((el) => el == option);

    if (synonymsQuestion && index != undefined && index == -1) {
      synonymsQuestion.selectedAns = [...synonymsQuestion.selectedAns, option];
    }

    if (synonymsQuestion && index != undefined && index > -1) {
      // remove the element
      synonymsQuestion.selectedAns.splice(index, 1);
      synonymsQuestion.selectedAns = [...synonymsQuestion.selectedAns];
    }
  }

  function checkAnswer() {
    showCorrectAns = true;
    showNextQuestionButton = true;

    if (synonymsQuestion) {
      // update the states
      questionRemaining = questionRemaining > 0 ? questionRemaining - 1 : 0;

      if (
        synonymsQuestion.correctAns.sort().join(",") ==
        synonymsQuestion.selectedAns.sort().join(",")
      ) {
        correctQuestion++;
      }
    }
  }
</script>

<Modal title="Settings" bind:open={clickOutsideModal} outsideclose>
  <Toggle size="small" checked={isRandom} on:change={toggleRandom}
    >Choose questions randomly</Toggle
  >
  <ButtonGroup>
    <Button on:click={handleQuestionRemainingDec}>-</Button>
    <Button># of questions: {totalQuestion}</Button>
    <Button on:click={handleQuestionRemainingInc}>+</Button>
  </ButtonGroup>
</Modal>

<svelte:head>
  <title
    >{listMeta
      ? `Synonyms Practice: ${listMeta.name}`
      : "Synonyms Practice"}</title
  >
</svelte:head>

<main class="my-6" in:fade>
  <DevComponent>
    <!-- content here -->
    <p>words {words.length}</p>
    <p>Current Index:{currentIndex}</p>
    <p>Has more data:{hasMore}</p>
    <p>Backup words:{backupWords.length}</p>
    <p>total Question {totalQuestion}</p>
    <p>Remaining {questionRemaining}</p>
    <p>Correct {correctQuestion}</p>
    <p>Quiz complete {completedQuiz}</p>
    <p>
      selectedAns {JSON.stringify(synonymsQuestion?.selectedAns)}
    </p>
    <p>
      selectedAns {JSON.stringify(synonymsQuestion?.correctAns)}
    </p>
    <p>
      All {JSON.stringify(synonymsQuestion?.options)}
    </p>
  </DevComponent>

  <div class="my-28">
    {#if completedQuiz == false}
      {#if words.length > 0}
        <!-- print stats -->

        <div class="flex justify-between">
          <div>
            Correct: {correctQuestion} / {totalQuestion}
          </div>
          <div>
            <button on:click={() => (clickOutsideModal = true)}>
              <SettingsIcon />
            </button>
          </div>
        </div>

        <!-- practice question -->
        {#if synonymsQuestion}
          <P class="my-3">
            <span class="font-bold">Q.</span> Select the synonyms of
            <strong class="uppercase">
              {synonymsQuestion.question}
            </strong>.
          </P>
          <!-- display options -->
          <div class="flex flex-col">
            {#each synonymsQuestion.options as option}
              <button
                class:cDisable={showCorrectAns}
                on:click={() =>
                  synonymsQuestion && !showCorrectAns ? setSynAns(option) : ""}
                class={synonymsQuestion.selectedAns
                  ? showCorrectAns
                    ? synonymsQuestion.selectedAns.includes(option)
                      ? synonymsQuestion.correctAns.includes(option)
                        ? "bg-green-300"
                        : "bg-red-300"
                      : synonymsQuestion.correctAns.includes(option)
                      ? "bg-green-300"
                      : ""
                    : synonymsQuestion.selectedAns.includes(option)
                    ? "bg-slate-200"
                    : ""
                  : ""}
              >
                <P
                  size="base"
                  weight="medium"
                  class="px-4 py-2 rounded border border-gray-200 dark:border-gray-700"
                  color="text-gray-900 dark:text-gray-900 "
                  >{option.charAt(0).toUpperCase() + option.slice(1)}</P
                >
              </button>
              <div class="mb-2" />
            {/each}
          </div>
          {#if showNextQuestionButton}
            <Button class="mt-3" on:click={buildQuestion}>Next</Button>
          {:else}
            <Button
              class="mt-3"
              disabled={synonymsQuestion.selectedAns.length == 0}
              on:click={checkAnswer}>Check</Button
            >
          {/if}
        {/if}
      {/if}
    {/if}
  </div>

  {#if loading && words.length == 0}
    <Heading tag="h5">Loading...&#128516;</Heading>
  {/if}

  {#if completedQuiz}
    <Heading tag="h5" class="mb-5">Completed Quiz...&#128516;</Heading>
    <Button on:click={resetQuiz}>Reset Quiz</Button>
  {/if}
</main>

<style>
  .cDisable {
    cursor: not-allowed;
  }
</style>
