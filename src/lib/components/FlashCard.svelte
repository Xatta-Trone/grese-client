<!-- @format -->
<script lang="ts">
  import { flipped, showNonGre } from "$lib/services/flashcard";
  import { Badge, P, Toggle } from "flowbite-svelte";

  let showBack: boolean;
  let showNonGreWords: boolean = false;
  export let word: Word;
  export let currentIndex: number;

  flipped.subscribe((val) => (showBack = val));

  function toggleShowBack() {
    flipped.set(!showBack);
    // showBack = !showBack;
  }

  showNonGre.subscribe((val) => (showNonGreWords = val));
  function toggleNonGre() {
    showNonGre.set(!showNonGreWords);
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
</script>

<div class="flex justify-between">
  <div class="capitalize">{word.word} (#{currentIndex + 1})</div>
  <div>
    <Toggle size="small" checked={showNonGreWords} on:change={toggleNonGre}
      >Show non-GRE synonyms</Toggle
    >
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
        {#if word.word_data}
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
        {/if}
      </div>
    </div>
  {/if}
</div>
