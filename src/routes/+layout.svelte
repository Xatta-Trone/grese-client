<script>
  import "../app.postcss";
  import Header from "./Header.svelte";
  // import "./styles.css";
</script>

<div class="app">
  <Header />

  <main class="container max-w-screen-lg mx-auto">
    <slot />
  </main>

  <footer class="container max-w-screen-lg mx-auto text-center clear-both">
    <p>
      visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
    </p>
  </footer>
</div>

<style>
  
</style>
