<!-- @format -->
<script lang="ts">
  import { page } from "$app/stores";
  import PricingComponent from "$lib/components/PricingComponent.svelte";
  import ChevronRightIcon from "$lib/icons/chevronRightIcon.svelte";
  import LoginIcon from "$lib/icons/loginIcon.svelte";
  import { Heading, Mark } from "flowbite-svelte";
  
</script>

<svelte:head>
  <title>Home: GRE SE</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <!-- hero section -->

  <section class="mt-16 mb-10">
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
          href="/profile"
          class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
        >
          <LoginIcon />
          <span class="inline-block ml-2">{$page.data.isLoggedIn ? 'Profile' : 'JOIN'}</span>
        </a>
      </div>
    </div>
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
