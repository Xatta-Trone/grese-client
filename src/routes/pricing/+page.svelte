<!-- @format -->
<script lang="ts">
  import PricingComponent from "$lib/components/PricingComponent.svelte";
  import { A, Heading } from "flowbite-svelte";
</script>

<svelte:head>
  <title>Pricing: GRE SE</title>
</svelte:head>

<div class="text-center">
  <Heading
    tag="h3"
    class="mt-10 mb-6"
    customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
    >Pricing Plans</Heading
  >
  <A href="commerce-disclosure">Commerce Disclosure</A>
</div>

<PricingComponent />
