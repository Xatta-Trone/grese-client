<!-- @format -->
<script lang="ts">
  import PricingComponent from "$lib/components/PricingComponent.svelte";
  import { Heading } from "flowbite-svelte";
</script>

<div class="text-center">
  <Heading
    tag="h3"
    class="mb-10 mt-10"
    customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
    >Pricing Plans</Heading
  >
</div>

<PricingComponent />
