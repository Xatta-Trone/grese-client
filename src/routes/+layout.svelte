<!-- @format -->
<script lang="ts">
  import {
    Footer,
    FooterCopyright,
    FooterLink,
    FooterLinkGroup,
  } from "flowbite-svelte";
  import { fade } from "svelte/transition";
  import "../app.postcss";
  import type { PageData } from "./$types";
  import Header from "./Header.svelte";

  export let data: PageData;
</script>

<svelte:head>
  <!-- Google tag (gtag.js) -->
  <!-- Google tag (gtag.js) -->
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-N8BZTFYJYC"
  ></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());

    gtag("config", "G-N8BZTFYJYC");
  </script>
</svelte:head>

<div class="app">
  <div class="container">
    <Header isLoggedIn={data.isLoggedIn} />
  </div>

  <main class="container max-w-screen-lg mx-auto" in:fade>
    <slot />
  </main>

  <Footer class="mt-10">
    <FooterCopyright href="/" by="Flowbite™" year={new Date().getFullYear()} />
    <FooterLinkGroup
      ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0"
    >
      <FooterLink href="/">About</FooterLink>
      <FooterLink href="/">Privacy Policy</FooterLink>
      <FooterLink href="/">Licensing</FooterLink>
      <FooterLink href="/">Contact</FooterLink>
    </FooterLinkGroup>
  </Footer>
</div>

<!-- <svelte:window on:popstate={popState} /> -->

<style>
</style>
