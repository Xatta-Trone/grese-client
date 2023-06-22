<!-- @format -->
<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { PUBLIC_AUTH_REDIRECT } from "$env/static/public";
</script>

<svelte:head>
  <title>Login</title>
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<main class="my-6">
  <Button href="login-google">Sign in with google</Button>

  <div>
    <div
      id="g_id_onload"
      data-client_id="930702663805-i5vtsuruh6fraqgjs1v0babc0pq1k9fh.apps.googleusercontent.com"
      data-context="use"
      data-ux_mode="redirect"
      data-login_uri="http://localhost:5173/auth"
      data-auto_prompt="false"
    />

    <div
      class="g_id_signin"
      data-type="standard"
      data-shape="rectangular"
      data-theme="outline"
      data-text="continue_with"
      data-size="large"
      data-logo_alignment="left"
    />
  </div>

  <script src="https://accounts.google.com/gsi/client" async defer></script>
  <script>
    function handleCredentialResponse(response) {
      console.log("Encoded JWT ID token: " + response.credential);
    }
    window.onload = function () {
      google.accounts.id.initialize({
        client_id: "930702663805-i5vtsuruh6fraqgjs1v0babc0pq1k9fh.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" } // customization attributes
      );
      google.accounts.id.prompt(); // also display the One Tap dialog
    };
  </script>
  <div>
    <div id="buttonDiv" />
  </div>
</main>
