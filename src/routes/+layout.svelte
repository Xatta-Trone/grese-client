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

  // let u:UserInterface|null

  // user.subscribe(val => {
  //   u = val
  // })
  // // import "./styles.css";
  // // @ts-ignore
  // function popState(event) {
  //   console.log(event, $page);

  //   if (window.location.pathname == "/auth") {
  //     history.go(-2);
  //   }
  // }

  // beforeNavigate(() => {
  //   console.log("before navigate called")

  //   // if(window.location.pathname == '/auth' && u != null) {
  //   //   goto('/profile')
  //   // }

  // })
</script>

<div class="app">
  <Header isLoggedIn={data.isLoggedIn} user={data.user} />

  <main class="container max-w-screen-lg mx-auto" in:fade>
    <slot />
  </main>

  <Footer class="mt-10">
    <FooterCopyright href="/" by="Flowbite™" year={(new Date()).getFullYear()} />
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
