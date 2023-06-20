<!-- @format -->
<script lang="ts">
  import "../app.postcss";
  import Header from "./Header.svelte";
  import { page } from "$app/stores";
  import { beforeNavigate, goto } from "$app/navigation";
  import { user, type UserInterface } from "$lib/services/auth";
  import type { PageData, PageServerData } from "./$types";

  export let data:PageData;

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
  <Header isLoggedIn={data.isLoggedIn} />

  <main class="container max-w-screen-lg mx-auto">
    <slot />
  </main>

  <footer class="container max-w-screen-lg mx-auto text-center clear-both">
    <p>
      visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
    </p>
  </footer>
</div>

<!-- <svelte:window on:popstate={popState} /> -->

<style>
</style>
