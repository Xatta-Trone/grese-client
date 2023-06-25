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
  import './styles.css';

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

<div class="app ">
  <div class="">
    <Header isLoggedIn={data.isLoggedIn} />
  </div>

  <main class="container max-w-screen-lg mx-auto" in:fade>
    <slot />
  </main>

  <Footer class="mt-10">
    <FooterCopyright href="/" by="GRE SE" year={new Date().getFullYear()} />
    <FooterLinkGroup
      ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0"
    >
      <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
      <FooterLink href="/terms-and-conditions">Terms & Conditions</FooterLink>
    </FooterLinkGroup>
  </Footer>
</div>
