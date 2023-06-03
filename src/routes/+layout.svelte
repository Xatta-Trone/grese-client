<script>
  import "../app.postcss";
  import Header from "./Header.svelte";
  import "./styles.css";
</script>

<div class="app">
  <Header />

  <main class="container mx-auto">
    <slot />
  </main>

  <footer class="container mx-auto">
    <p>
      visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
    </p>
  </footer>
</div>

<style>
  
</style>
