<!-- @format -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import axiosAPI from "$lib/services/customAxios.js";
  import {
    Label,
    Helper,
    Input,
    Button,
    Alert,
    A,
    Select,
  } from "flowbite-svelte";
  

  //import type { PageData } from './$types';
  import { superForm } from "sveltekit-superforms/client";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";

  export let data; // : PageData

  //   select data
  let countries = [
    { value: 1, name: "Everyone" },
    { value: 2, name: "Only me" },
  ];

  const { form, errors, constraints, message } = superForm(data.form, {
    resetForm: false,
  });

  function testa() {
    console.log("aaa");
    axiosAPI.get("/");
  }
</script>

<div class="mt-5">
  <SuperDebug data={$form} />

  <form method="POST" use:enhance class="mb-9">
    {#if $message}
      <h3>{$message}</h3>
    {/if}
    { $page.status }
    <Alert color="dark" class="mb-3">
      You can easily import vocabulary sets or folders from <A
        href="https://quizlet.com"
        rel="external"
        target="_blank"
        class="font-medium hover:underline">quizlet.com</A
      >, <A
        href="https://vocabulary.com"
        rel="external"
        target="_blank"
        class="font-medium hover:underline">vocabulary.com</A
      >, or <A
        href="https://memrise.com"
        rel="external"
        target="_blank"
        class="font-medium hover:underline">memrise.com</A
      >. Simply copy and paste the URL of the set or folder you want to import,
      and we'll take care of the rest for you.
    </Alert>

    <div class="mb-6">
      <Label
        for="url"
        color={$errors.url ? "red" : undefined}
        class="block mb-2">URL</Label
      >
      <Input
        id="url"
        color={$errors.url ? "red" : undefined}
        placeholder="https://quizlet.com/saint1729/folders/gregmat/sets"
        name="url"
        bind:value={$form.url}
        {...$constraints.url}
      />
      {#if $errors.url}
        <Helper class="mt-2" color="red">
          <span class="font-bold">{$errors.url}</span></Helper
        >{/if}
    </div>

    <div class="mb-6">
      <Label
        >Visible to
        <Select
          class="mt-2"
          name="visibility"
          items={countries}
          bind:value={$form.visibility}
          {...$constraints.visibility}
        />
      </Label>
    </div>

    <Button type="submit">Import data</Button>
  </form>
</div>

<style>
</style>
