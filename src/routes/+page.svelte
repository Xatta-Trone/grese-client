<script lang="ts">
  import Counter from "./Counter.svelte";
  import welcome from "$lib/images/svelte-welcome.webp";
  import welcome_fallback from "$lib/images/svelte-welcome.png";

  import { user,logout } from "$lib/services/auth";
  import type { UserInterface } from "$lib/services/auth";

  let userData: UserInterface | null ;


  user.subscribe(value => {
    userData = value
  });

  // @ts-ignore
  function handleCallback(e) {
	console.log(e)
  }

//   window.handleCallback = handleCallback
</script>
<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<section>
  <h1>
    <span class="welcome">
      <picture>
        <source srcset={welcome} type="image/webp" />
        <img src={welcome_fallback} alt="Welcome" />
      </picture>
    </span>

    to your new<br />SvelteKit app
  </h1>

  <a href="/login">Login</a>
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a on:click={() => logout()} href="#">Logout</a>

  <h3>{ JSON.stringify(userData) }</h3>

  <h2>
    try editing <strong>src/routes/+page.svelte</strong>
  </h2>

  <Counter />
</section>
<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  h1 {
    width: 100%;
  }

  .welcome {
    display: block;
    position: relative;
    width: 100%;
    height: 0;
    padding: 0 0 calc(100% * 495 / 2048) 0;
  }

  .welcome img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: block;
  }
</style>
