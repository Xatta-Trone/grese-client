<!-- @format -->
<script lang="ts">
  import { login } from "$lib/services/auth";
  import type { PageData } from "./$types";

  export let data: PageData;

  login(data.user.name, data.user.email, data.token);
</script>
<h1>{data.user}</h1>
<h1>{data.user.name}</h1>
