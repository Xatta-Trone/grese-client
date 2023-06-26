<!-- @format -->
<script lang="ts">
  import SettingsIcon from "$lib/icons/settingsIcon.svelte";
  import type {
    ListMeta,
    Meta,
    PartsOfSpeech,
    SingleSetResponse,
    Word,
  } from "$lib/interfaces/setData";
  import singleSetData from "$lib/utils/dummyData.json";
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

  interface Question {
    wordId: number;
    question: string;
    correctAns: string;
    selectedAns: string | null;
    questionType: QuestionType;
    options: string[];
  }
  enum QuestionType {
    WORD,
    DEFINITION,
  }

  // data variables
  // let currentPage = 1;
  // let per_page = 50;
  let words: Word[] = [];
  let backupWords: Word[] = [];
  let newWords: Word[] = [];
  let listMeta: ListMeta;
  let meta: Meta;
  let loading = false;
  let hasMore = true;
  // let query: string = "";

  $: words = [...words, ...newWords];

  onMount(async () => {
    const data: SingleSetResponse = JSON.parse(JSON.stringify(singleSetData));
    console.log(data);
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
      // newWords = data.words;
      backupWords = [...backupWords, ...filteredWords];
      totalQuestion = backupWords.length;
      questionRemaining = backupWords.length;
      hasMore = false;
    }

    currentIndex = 0;
    buildQuestion();
  });

  let currentIndex: number = 0;
  let isRandom = false;
  let completedQuiz = false;
  let questionType: QuestionType = QuestionType.WORD;
  let question: Question | null = null;
  let totalQuestion: number = 0;
  let questionRemaining: number = 0;
  let correctQuestion: number = 0;

  function buildQuestion() {
    if (question != null) {
      // remove the current element
      words.splice(
        words.findIndex((word) => word.id == question?.wordId),
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
      const questionToPopulate: Question = {
        wordId: 0,
        question: "",
        selectedAns: null,
        correctAns: "",
        questionType: questionType,
        options: [],
      };

      // populate the question
      questionToPopulate.wordId = word.id;

      if (
        questionType == QuestionType.WORD &&
        word.word_data.partsOfSpeeches != null
      ) {
        questionToPopulate.question = word.word;
        questionToPopulate.correctAns =
          word.word_data.partsOfSpeeches[0].definitions[0];
        questionToPopulate.options.push(
          word.word_data.partsOfSpeeches[0].definitions[0]
        );
      } else {
        // select POS
        const pos: PartsOfSpeech | null =
          word.word_data.partsOfSpeeches != null
            ? word.word_data.partsOfSpeeches[0]
            : null;
        //  if its null, then re run the function
        if (pos == null || pos.definitions[0].trim().length == 0) {
          buildQuestion();
          return;
        } else {
          questionToPopulate.question = pos.definitions[0];
          questionToPopulate.correctAns = word.word;
        }
      }

      // now add additional answers
      const additionalAns = buildAdditionalAnswer(
        questionToPopulate.questionType,
        word.id,
        questionToPopulate.correctAns
      );
      questionToPopulate.options = [...additionalAns];
      // randomize the array
      questionToPopulate.options = shuffle(questionToPopulate.options);

      question = questionToPopulate;
    }
  }

  function setAns(option: string) {
    if (question) {
      question.selectedAns = option;
      // update the states
      questionRemaining = questionRemaining > 0 ? questionRemaining - 1 : 0;

      if (question.correctAns == question.selectedAns) {
        correctQuestion++;
      }
    }
  }

  function buildAdditionalAnswer(
    type: QuestionType,
    wordId: number,
    correctAns: string
  ): string[] {
    let additionalAns: string[] = [correctAns];
    const totalOption: number = 5;

    if (type == QuestionType.WORD) {
      while (additionalAns.length < totalOption) {
        // find random definition
        let randomWord: Word =
          backupWords[Math.floor(Math.random() * backupWords.length)];
        if (randomWord.word_data.partsOfSpeeches == null) {
          continue;
        }
        const definition: string =
          randomWord.word_data.partsOfSpeeches[0].definitions[0];

        if (
          randomWord.id == wordId ||
          additionalAns.some((ans) => ans == definition)
        ) {
          continue;
        } else {
          additionalAns.push(definition);
        }
      }
    }

    if (type == QuestionType.DEFINITION) {
      while (additionalAns.length < totalOption) {
        // find random definition
        let randomWord: Word =
          backupWords[Math.floor(Math.random() * backupWords.length)];
        const word: string = randomWord.word;

        if (
          randomWord.id == wordId ||
          additionalAns.some((ans) => ans == word)
        ) {
          continue;
        } else {
          additionalAns.push(word);
        }
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
      question = null;
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

  function toggleQuestionType() {
    if (questionType == QuestionType.DEFINITION) {
      questionType = QuestionType.WORD;
    } else {
      questionType = QuestionType.DEFINITION;
    }
    resetQuiz();
  }

  function handleQuestionRemainingInc() {
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
</script>

<Modal title="Settings" bind:open={clickOutsideModal} outsideclose>
  <Toggle size="small" checked={isRandom} on:change={toggleRandom}
    >Choose questions randomly</Toggle
  >
  <Toggle
    size="small"
    checked={questionType == QuestionType.WORD}
    on:change={toggleQuestionType}
    >Question Type ({questionType == QuestionType.WORD
      ? "word"
      : "definition"})</Toggle
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
      ? `Practice definition: ${listMeta.name}`
      : "Practice definition"}</title
  >
</svelte:head>

<main class="my-0" in:fade>
  <div class="my-0">
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

        {#if question}
          <P class="my-3">
            {#if question.questionType == QuestionType.WORD}
              <span class="font-bold">Q.</span> Select the best definition of
              <strong class="uppercase">
                {question.question}
              </strong>.
            {:else}
              <span class="font-bold">Q.</span>
              <strong class="">
                {question.question.charAt(0).toUpperCase() +
                  question.question.slice(1)}
              </strong>
            {/if}
          </P>
          <div class="flex flex-col">
            {#each question.options as option}
              <button
                class={question.selectedAns
                  ? question.selectedAns == option
                    ? question.selectedAns == question.correctAns
                      ? " bg-green-300"
                      : "bg-red-300"
                    : question.correctAns == option
                    ? "bg-green-300"
                    : ""
                  : ""}
                class:cDisable={question.selectedAns != null &&
                  question.selectedAns != option}
                class:cPointer={question.selectedAns != null &&
                  question.selectedAns == option}
                disabled={question.selectedAns != null ? true : false}
                on:click={() => (question ? setAns(option) : "")}
              >
                <P
                  size="base"
                  weight="medium"
                  class="px-4 py-2 rounded border border-gray-200 dark:border-gray-700"
                  color="text-gray-900 dark:text-gray-900 "
                >
                  {option}</P
                >
              </button>
              <div class="mb-2" />
            {/each}
          </div>
          <Button
            class="mt-3"
            disabled={question.selectedAns == null}
            on:click={buildQuestion}>Next</Button
          >
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

  .cPointer {
    cursor: pointer;
  }
</style>
