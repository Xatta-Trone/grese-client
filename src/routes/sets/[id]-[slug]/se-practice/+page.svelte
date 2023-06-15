<!-- @format -->
<script lang="ts">
  import { dev } from "$app/environment";
  import { P, Button } from "flowbite-svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  interface QuestionInterface {
    wordId: number;
    question: string;
    correctAns: string[][];
    selectedAns: string[];
    options: string[];
  }

  const question: QuestionInterface = {
    wordId: 0,
    question: "Select in pairs",
    correctAns: [
      ["a", "b"],
      ["c", "d"],
    ],
    selectedAns: [],
    options: ["a", "b", "c", "d", "e", "f"],
  };

  let showCorrectAns: boolean = false;
  let showNextQuestionButton: boolean = false;

  function setSynAns(option: string) {
    // index
    const index = question?.selectedAns.findIndex((el) => el == option);

    if (question && index != undefined && index == -1) {
      question.selectedAns = [...question.selectedAns, option];
    }

    if (question && index != undefined && index > -1) {
      // remove the element
      question.selectedAns.splice(index, 1);
      question.selectedAns = [...question.selectedAns];
    }
  }

  function checkCorrectAns(option: string) {
    // get the question number
    const questionNumber: number = getIndex(option);

    console.log("questionNumber", questionNumber);

    let tempAnsArray: string[] = [];

    // get the answer couple form the selected ans array
    if (questionNumber == 1) {
      tempAnsArray.push(question.selectedAns[0], question.selectedAns[1]);
    }

    if (questionNumber == 2) {
      tempAnsArray.push(question.selectedAns[2], question.selectedAns[3]);
    }

    if (questionNumber == 3) {
      tempAnsArray.push(question.selectedAns[4], question.selectedAns[5]);
    }

    console.log("tempAnsArray", tempAnsArray);

    // now check the answer array against the correct ans array
    let isAnsCorrect: boolean = false;

    // question.correctAns.forEach((correctAns) => {
    //   isAnsCorrect =
    //     correctAns.sort().join(",") == tempAnsArray.sort().join(",");

    // });

    isAnsCorrect = question.correctAns.some(
      (singleCorrectAns) =>
        singleCorrectAns.sort().join(",") == tempAnsArray.sort().join(",")
    );

    console.log("isAnsCorrect", isAnsCorrect);

    return isAnsCorrect;
  }

  function getIndex(option: string) {
    if (question && question.selectedAns.includes(option)) {
      const index: number = question.selectedAns.findIndex(
        (el) => el == option
      );

      switch (index) {
        case 0:
        case 1:
          return 1;
        case 2:
        case 3:
          return 2;
        case 4:
        case 5:
          return 3;

        default:
          break;
      }
    }
    return -1;
  }

  function checkAnswer() {
    showCorrectAns = true;
    showNextQuestionButton = true;
  }
</script>

<main class="my-6">
  {#if dev}
    <div class="p-5 border border-slate-950">
      <p>
        selectedAns {JSON.stringify(question?.selectedAns)}
      </p>
      <p>
        correctAns {JSON.stringify(question?.correctAns)}
      </p>
      <p>
        All {JSON.stringify(question?.options)}
      </p>
    </div>
  {/if}

  <!-- practice question -->
  {#if question}
    <P class="my-3">
      <span class="font-bold">Q.</span> Select the synonyms of
      <strong class="uppercase">
        {question.question}
      </strong>.
    </P>
    <!-- display options -->
    <div class="flex flex-col">
      {#each question.options as option}
        <button
          class:cDisable={showCorrectAns}
          on:click={() =>
            question && !showCorrectAns ? setSynAns(option) : ""}
          class={question.selectedAns
            ? showCorrectAns
              ? question.selectedAns.includes(option)
                ? checkCorrectAns(option)
                  ? "bg-green-300"
                  : "bg-red-300"
                : checkCorrectAns(option)
                ? "bg-green-300"
                : ""
              : question.selectedAns.includes(option)
              ? "bg-slate-200"
              : ""
            : ""}
        >
          <P
            size="lg"
            weight="light"
            class="px-4 py-2 rounded border border-gray-200 dark:border-gray-700"
            color="text-gray-900 dark:text-gray-900 "
            >{getIndex(option) != -1 ? getIndex(option) : ""} || {option}</P
          >
        </button>
        <div class="mb-2" />
      {/each}
    </div>
    <Button class="mt-3" on:click={checkAnswer}>Check</Button>
  {/if}
</main>

<style>
  .cDisable {
    cursor: not-allowed;
  }
</style>
