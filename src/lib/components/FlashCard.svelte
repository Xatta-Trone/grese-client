<!-- @format -->
<script lang="ts">
  import { browser } from "$app/environment";
  import SettingsIcon from "$lib/icons/settingsIcon.svelte";
  import SpeakerIcon from "$lib/icons/speakerIcon.svelte";
  import { LearningState } from "$lib/interfaces/setData";
  import { autoSpeak, flipped, showNonGre } from "$lib/services/flashcard";
  import { Badge, Button, Modal, P, Toggle } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
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
    partsOfSpeeches: PartsOfSpeech[] | null;
  }

  interface PartsOfSpeech {
    partsOfSpeech: string;
    definitions: string[];
    examples: string[];
    synonyms_gre: string[];
    synonyms_normal: string[];
  }

  export let word: Word;
  export let currentIndex: number;
  export let learningState: LearningState;

  let showBack: boolean;
  flipped.subscribe((val) => (showBack = val));
  function toggleShowBack() {
    flipped.set(!showBack);
    // showBack = !showBack;
  }

  let showNonGreWords = false;
  showNonGre.subscribe((val) => (showNonGreWords = val));
  function toggleNonGre() {
    showNonGre.set(!showNonGreWords);
  }

  let autoSpeakValue = false;
  autoSpeak.subscribe((val) => (autoSpeakValue = val));
  function toggleAutoSpeak() {
    autoSpeak.set(!autoSpeakValue);
  }

  // text to speech
  function speak() {
    if (browser) {
      window.speechSynthesis.cancel();
      var msg = new SpeechSynthesisUtterance();
      msg.text = word.word;
      window.speechSynthesis.speak(msg);
    }
  }

  onMount(() => {
    console.log("mounted", word);
    if (autoSpeakValue) {
      speak();
    }
  });

  // modal
  let clickOutsideModal = false;
</script>

<main in:fade|global class="my-6">
  <Modal
    title="Flashcard settings"
    bind:open={clickOutsideModal}
    autoclose
    outsideclose
  >
    <Toggle size="small" checked={autoSpeakValue} on:change={toggleAutoSpeak}
      >Auto pronounce</Toggle
    >
    <Toggle size="small" checked={showNonGreWords} on:change={toggleNonGre}
      >Show non-GRE synonyms</Toggle
    >
    <svelte:fragment slot="footer">
      <Button color="alternative">Close</Button>
    </svelte:fragment>
  </Modal>

  <div class="flex justify-between">
    <div class="capitalize">
      {word.word} (#{currentIndex + 1})
      <!-- learnings tate -->
      {#if learningState == LearningState.MASTERED}
        <Badge color="green">Mastered</Badge>
      {:else if learningState == LearningState.LEARNING}
        <Badge color="yellow">Learning</Badge>
      {:else}
        <Badge color="dark">Unknown</Badge>
      {/if}
      <button class="inline cursor-pointer" on:click={speak}
        ><SpeakerIcon /></button
      >
    </div>
    <div>
      <button on:click={() => (clickOutsideModal = true)}>
        <SettingsIcon />
      </button>
    </div>
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    class="mb-6 mt-2 relative w-100 mx-auto cursor-pointer font-bold tracking-light text-lg"
    on:click={() => {
      toggleShowBack();
    }}
  >
    {#if !showBack}
      <div
        class="card-front text-center px-16 py-36 bg-white overflow-hidden inset-0 rounded-lg shadow-lg border border-slate-300"
      >
        <div class="flex justify-center content-center h-100 w-100 capitalize">
          <P size="3xl" weight="bold" class="capitalize">{word.word}</P>
        </div>
      </div>
    {:else}
      <div
        class="card-front p-2 bg-white overflow-hidden inset-0 rounded-lg shadow-lg border"
      >
        <div class="grid grid-flow-col gap-5 place-items-stretch h-100 w-100">
          {#if word.word_data && word.word_data.partsOfSpeeches != null}
            {#each word.word_data.partsOfSpeeches as pos}
              <div class="border border-zinc-200 rounded-lg mx-auto px-2 py-3">
                {#each pos.definitions as def}
                  <div
                    class="block bg-white rounded-full p-2 shadow text-teal text-sm mb-1"
                  >
                    <div class="inline-flex items-center">
                      <Badge rounded large>{pos.partsOfSpeech}</Badge>
                      <P size="sm" class="ml-2">{def}</P>
                    </div>
                  </div>
                {/each}
                {#each pos.examples as ex}
                  <div
                    class="block bg-white rounded-full p-2 shadow text-teal text-sm mb-1"
                  >
                    <div class="inline-flex items-center">
                      <Badge rounded large>Example</Badge>
                      <P size="sm" class="ml-2">{ex}</P>
                    </div>
                  </div>
                {/each}
                <P size="xl" weight="semibold" class="my-2">Synonyms (GRE)</P>

                {#each pos.synonyms_gre as sn}
                  <Badge large color="dark" class="mx-1">{sn}</Badge>
                {/each}

                {#if showNonGreWords}
                  <P size="xl" weight="semibold" class="my-2"
                    >Synonyms (Non-GRE)</P
                  >

                  {#each pos.synonyms_normal as sn}
                    <Badge large color="dark" class="mx-1">{sn}</Badge>
                  {/each}
                {/if}
              </div>
            {/each}
          {:else}
            <div class="py-10">
              <P size="xl" weight="bold" class="capitalize text-red-600" align="center"
              >No Parts of speech data found</P
            >
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</main>
