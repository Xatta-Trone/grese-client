<!-- @format -->
<script lang="ts">
  import { page } from "$app/stores";
  import { dev } from "$app/environment";
  import { P, Button, Badge, Heading } from "flowbite-svelte";
  import axiosAPI from "$lib/services/customAxios";
  import { onMount } from "svelte";
  import type {
    ListMeta,
    Meta,
    SingleSetResponse,
    Word,
  } from "$lib/interfaces/setData";
  import DevComponent from "$lib/components/DevComponent.svelte";
  // call and get the data
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
          // set the total question
          totalQuestion = listMeta.word_count;
          questionRemaining = listMeta.word_count;
        }

        if (data.words.length) {
          words = [...words, ...data.words];
          // newWords = data.words;
          backupWords = [...backupWords, ...data.words];
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

  interface QuestionInterface {
    wordId: number[];
    question: string;
    correctAns: string[][];
    selectedAns: string[];
    options: string[];
  }

  // with questions
  let currentIndex: number = 0;
  let completedQuiz: boolean = false;
  let totalQuestion: number = 0;
  let questionRemaining: number = 0;
  let correctQuestion: number = 0;
  let synonymsQuestion: QuestionInterface | null = null;
  let cAns: string[] = []; // because synonymsQuestion was being polluted

  function buildQuestion() {
    cAns = [];
    if (synonymsQuestion != null) {
      // remove the current questions
      synonymsQuestion.wordId.forEach((idx) => {
        words.splice(
          words.findIndex((word) => word.id == idx),
          1
        );
      });
      words = [...words]; // reactivity
      questionRemaining = words.length;
    }

    // check remaining questions
    if (questionRemaining <= 0) {
      completedQuiz = true;
      return;
    }

    // first choose number of correct pairs randomly
    const MIN_ANS_SIZE = 1;
    const MAX_ANS_SIZE = words.length < 3 ? words.length : 3;
    const numberOfPairs: number = Math.floor(
      Math.random() * (MAX_ANS_SIZE - MIN_ANS_SIZE + 1) + MIN_ANS_SIZE
    );

    console.log("pair size", numberOfPairs);

    // now set the question
    const questionToPopulate: QuestionInterface = {
      wordId: [],
      question: "in pairs",
      selectedAns: [],
      correctAns: [],
      options: [],
    };

    while (questionToPopulate.wordId.length < numberOfPairs) {
      // get a word randomly
      const word: Word = words[Math.floor(Math.random() * words.length)];

      // now populate the data

      // check if already exists
      if (questionToPopulate.wordId.includes(word.id)) {
        continue;
      }

      // get all the synonyms
      let tempSynonyms: string[] = [];

      word.word_data.partsOfSpeeches.forEach((pos) => {
        tempSynonyms.push(...pos.synonyms_gre);
      });

      // remove duplicated
      // tempSynonyms = tempSynonyms.filter((el) => el != word.word);

      // randomly select an synonym
      console.log(tempSynonyms);

      // check if no synonyms exists
      // then remove this word

      if (tempSynonyms.length == 0) {
        words.splice(
          words.findIndex((wordIdx) => word.id == wordIdx.id),
          1
        );
        words = [...words];
        questionRemaining = words.length;
        buildQuestion();
        return;
      }

      if (tempSynonyms.length < 2) {
        continue;
      } else {
        // for safety push word id later
        questionToPopulate.wordId.push(word.id);
        const option1: string = word.word;
        let option2: string;

        // randomly select the other option

        option2 = tempSynonyms[Math.floor(Math.random() * tempSynonyms.length)];

        // now push it in the question
        questionToPopulate.correctAns.push([option1, option2]);
      }
    }

    // now build additional ans
    const additionalData: string[] = buildAdditionalAnswer(questionToPopulate);
    // randomize the array
    questionToPopulate.options = shuffle(additionalData);

    synonymsQuestion = questionToPopulate;
    //   reset the state
    showNextQuestionButton = false;
    showCorrectAns = false;
  }

  function buildAdditionalAnswer(question: QuestionInterface): string[] {
    let additionalAns: string[] = [];
    const totalOption: number = 6;
    let additionalAnsIdArray: number[] = []; // this one used to prevent adding same word value twice

    // first add the correct ans to the additional ans
    question.correctAns.forEach((el) => additionalAns.push(...el));

    // now populate remaining fields

    while (additionalAns.length < totalOption) {
      // find random word
      let randomWord: Word =
        backupWords[Math.floor(Math.random() * backupWords.length)];

      // check if already exists in the correct ans
      // no need to check for the 2nd synonym, because the first synonym was the word
      if (
        additionalAns.includes(randomWord.word) ||
        additionalAnsIdArray.includes(randomWord.id)
      ) {
        continue;
      } else {
        // merge all the synonyms
        let tempSynonyms: string[] = [randomWord.word];
        randomWord.word_data.partsOfSpeeches.forEach((pos) => {
          tempSynonyms = [...tempSynonyms, ...pos.synonyms_gre];
        });

        // get one randomly
        const randomSynonym: string =
          tempSynonyms[Math.floor(Math.random() * tempSynonyms.length)];

        if (additionalAns.includes(randomSynonym)) {
          continue;
        }

        // push it to the additional ans
        additionalAns.push(randomSynonym);
        additionalAnsIdArray.push(randomWord.id);
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

  // const question: QuestionInterface = {
  //   wordId: [0],
  //   question: "Select in pairs",
  //   correctAns: [
  //     ["a", "b"],
  //     ["c", "d"],
  //   ],
  //   selectedAns: [],
  //   options: ["a", "b", "c", "d", "e", "f"],
  // };

  let showCorrectAns: boolean = false;
  let showNextQuestionButton: boolean = false;

  function setSynAns(option: string) {
    // index
    const index = synonymsQuestion?.selectedAns.findIndex((el) => el == option);

    if (synonymsQuestion && index != undefined && index == -1) {
      synonymsQuestion.selectedAns = [...synonymsQuestion.selectedAns, option];
      cAns.push(option);
    }

    if (synonymsQuestion && index != undefined && index > -1) {
      // remove the element
      synonymsQuestion.selectedAns.splice(index, 1);
      synonymsQuestion.selectedAns = [...synonymsQuestion.selectedAns];
      cAns.splice(index, 1);
    }

    console.log(synonymsQuestion?.selectedAns, "Cans", cAns);
  }

  function checkCorrectAns(option: string) {
    // get the question number
    const questionNumber: number = getIndex(option);

    console.log("questionNumber", questionNumber, option);
    console.log("questionNumber", synonymsQuestion?.selectedAns);

    let tempAnsArray: string[] = [];

    // get the answer couple form the selected ans array
    if (synonymsQuestion && questionNumber == 1) {
      tempAnsArray.push(
        // synonymsQuestion.selectedAns[0],
        // synonymsQuestion.selectedAns[1]
        cAns[0],
        cAns[1]
      );
    }

    if (synonymsQuestion && questionNumber == 2) {
      tempAnsArray.push(
        // synonymsQuestion.selectedAns[2],
        // synonymsQuestion.selectedAns[3]
        cAns[2],
        cAns[3]
      );
    }

    if (synonymsQuestion && questionNumber == 3) {
      tempAnsArray.push(
        // synonymsQuestion.selectedAns[4],
        // synonymsQuestion.selectedAns[5]
        cAns[4],
        cAns[5]
      );
    }

    // console.log("tempAnsArray", tempAnsArray);

    // now check the answer array against the correct ans array
    let isAnsCorrect: boolean = false;

    if (synonymsQuestion) {
      isAnsCorrect = synonymsQuestion?.correctAns.some((singleCorrectAns) => {
        // console.log(
        //   "isAnsCorrect",
        //   singleCorrectAns.sort().join(",") == tempAnsArray.sort().join(",")
        // );
        return (
          singleCorrectAns.sort().join(",") == tempAnsArray.sort().join(",")
        );
      });
    }

    // console.log("isAnsCorrect", isAnsCorrect);

    return isAnsCorrect;
  }

  function getIndex(option: string) {
    if (synonymsQuestion && synonymsQuestion.selectedAns.includes(option)) {
      const index: number = synonymsQuestion.selectedAns.findIndex(
        (el) => el == option
      );

      // console.log("getIndex", option, index, synonymsQuestion.selectedAns);

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

    if (synonymsQuestion) {
      // update the states
      // questionRemaining = questionRemaining > 0 ? words.length : 0;

      let correctAns: string[] = synonymsQuestion.correctAns.reduce(
        (elem1, elem2) => elem1.concat(elem2)
      );
      let selectedAns: string[] = synonymsQuestion.selectedAns;

      if (correctAns.sort().join(",") == selectedAns.sort().join(",")) {
        correctQuestion++;
      }
    }
  }
  function resetQuiz() {
    if (listMeta) {
      // set the total question
      words = [...backupWords];
      synonymsQuestion = null;
      completedQuiz = false;
      questionRemaining = words.length;
      correctQuestion = 0;
      currentIndex = 0;
      buildQuestion();
    } else {
      alert("There was an error");
    }
  }
</script>

<main class="my-6">
  <DevComponent>
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
      correctAns {JSON.stringify(synonymsQuestion?.correctAns)}
    </p>
    <p>
      All {JSON.stringify(synonymsQuestion?.options)}
    </p>
  </DevComponent>

  {#if completedQuiz == true}
    <Heading tag="h5" class="mb-5">Completed Quiz...&#128516;</Heading>
    <Button on:click={resetQuiz}>Reset Quiz</Button>
    <!-- content here -->
  {:else}
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
                  ? checkCorrectAns(option)
                    ? "bg-green-300"
                    : "bg-red-300"
                  : checkCorrectAns(option)
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
              >{option.charAt(0).toUpperCase() + option.slice(1)}

              {#if getIndex(option) != -1}
                <Badge rounded>Pair {getIndex(option)}</Badge>
              {/if}
            </P>
          </button>
          <div class="mb-2" />
        {/each}
      </div>
      <!-- <Button class="mt-3" on:click={checkAnswer}>Check</Button> -->
      {#if showNextQuestionButton}
        <Button class="mt-3" on:click={buildQuestion}>Next</Button>
        <span class="ml-2 mr-1">Correct pairs: </span>

        {#each synonymsQuestion.correctAns as item}
          <Badge large color="green" class="mx-1">{item[0]}, {item[1]}</Badge>
        {/each}
      {:else}
        <Button
          class="mt-3"
          disabled={synonymsQuestion.selectedAns.length == 0 ||
            synonymsQuestion.selectedAns.length % 2 == 1}
          on:click={checkAnswer}>Check</Button
        >
      {/if}
    {/if}
  {/if}
</main>

<style>
  .cDisable {
    cursor: not-allowed;
  }
</style>
