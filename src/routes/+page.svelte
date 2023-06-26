<!-- @format -->
<script lang="ts">
  import PricingComponent from "$lib/components/PricingComponent.svelte";
  import DefinitionMatchDemo from "$lib/components/demo-components/DefinitionMatchDemo.svelte";
  import FlashCardDemoComponent from "$lib/components/demo-components/FlashCardDemoComponent.svelte";
  import SePractice from "$lib/components/demo-components/SePractice.svelte";
  import SynonymPractice from "$lib/components/demo-components/SynonymPractice.svelte";
  import ChevronRightIcon from "$lib/icons/chevronRightIcon.svelte";
  import DashboardIcon from "$lib/icons/dashboardIcon.svelte";
  import { Badge, Button, Heading, Mark, Modal, P } from "flowbite-svelte";

  // modals
  let flashCardModal = false;
  let definitionMatchModal = false;
  let synonymPracticeModal = false;
  let sEPracticeModal = false;
</script>

<svelte:head>
  <title>Home: GRE SE</title>
</svelte:head>

<section>
  <!-- hero section -->

  <section class="my-28">
    <div
      class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12"
    >
      <h1
        class="mb-4 text-4xl font-bold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
      >
        <Mark>GRE SE</Mark> <span class="uppercase">Bridging the Lacuna</span>
      </h1>
      <p
        class="mb-10 mt-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
      >
        Here at GRE-SE we are providing a platform to master your GRE vocabulary
        preparation.
      </p>
      <div
        class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
      >
        <a
          href="/sets"
          class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
        >
          <span class="inline-block mr-2">BROWSE</span>
          <ChevronRightIcon />
        </a>
        <a
          href="#demo"
          class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
        >
          <DashboardIcon />
          <span class="inline-block ml-2">VIEW DETAILS</span>
        </a>
      </div>
    </div>
  </section>

  <!-- demo -->

  <section id="demo">
    <div class="text-center">
      <Heading
        tag="h5"
        class="mb-10 mt-10"
        customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
        >What Do You Get</Heading
      >
    </div>
    <!-- contents -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 py-20">
      <div>
        <Heading tag="h2">Flash Cards</Heading>
        <P class="mt-6 mb-8 text-justify"
          >Your good old friend flash card. In the flash card section, you can
          learn and mark words (in a group) as unknown, learning, mastered.
          These groups is used in the other sections as practice modules.
        </P>
        <Button on:click={() => (flashCardModal = true)}>Try Demo</Button>
      </div>
      <div>
        <video autoplay muted loop playsinline>
          <source src="./videos/flashcards.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
    <Modal
      size="xl"
      title="Flash Card Demo"
      bind:open={flashCardModal}
      outsideclose
    >
      <FlashCardDemoComponent />
    </Modal>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 py-20">
      <div>
        <video autoplay muted loop playsinline>
          <source src="./videos/definition-match.mp4" type="video/mp4" />
        </video>
      </div>

      <div>
        <Heading tag="h2">Definition Match</Heading>
        <P class="mt-6 mb-8 text-justify"
          >In the definition match you can practice your verbal skills by
          selecting the best definition for a given word. Moreover, you can flip
          the question type where you will be given the definition and will be
          asked to select the best word. Here, you can also set the number of
          words you want to practice.
        </P>
        <Button on:click={() => (definitionMatchModal = true)}>Try Demo</Button>
      </div>
    </div>
    <Modal
      size="xl"
      title="Definition Match Demo"
      bind:open={definitionMatchModal}
      outsideclose
    >
      <DefinitionMatchDemo />
    </Modal>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 py-20">
      <div>
        <Heading tag="h2">Synonyms Practice</Heading>
        <P class="mt-6 mb-8 text-justify"
          >In synonyms practice, you will be given a word and 6 options to
          choose from. The correct answer could be from at least one to at most
          6 options. In here, you can choose the questions randomly and set the
          number of questions you want to practice.
        </P>
        <Button on:click={() => (synonymPracticeModal = true)}>Try Demo</Button>
      </div>
      <div>
        <video autoplay muted loop playsinline>
          <source src="./videos/synonym.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
    <Modal
      size="xl"
      title="Synonyms Demo"
      bind:open={synonymPracticeModal}
      outsideclose
    >
      <SynonymPractice />
    </Modal>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 py-20">
      <div>
        <video autoplay muted loop playsinline>
          <source src="./videos/definition-match.mp4" type="video/mp4" />
        </video>
      </div>

      <div>
        <Heading tag="h2">Sentence Equivalence <Badge>Plus</Badge></Heading>
        <P class="mt-6 mb-8 text-justify"
          >In this module you will be given 3 pairs of options and no questions.
          You will be asked to select the options in correct pairs. The main
          objective of this section is to enhance your capability of word
          pairing. Selecting all the correct pairs gives you one point and vice
          versa.
        </P>
        <Button on:click={() => (sEPracticeModal = true)}>Try Demo</Button>
      </div>
    </div>

    <Modal
      size="xl"
      title="Sentence Equivalence Demo"
      bind:open={sEPracticeModal}
      outsideclose
    >
      <SePractice />
    </Modal>

    <!-- end contents -->
  </section>

  <!-- pricing -->

  <section>
    <div class="text-center">
      <Heading
        tag="h5"
        class="mb-6 mt-10"
        customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
        >Pricing Plans</Heading
      >
    </div>
    <PricingComponent />
  </section>
</section>
