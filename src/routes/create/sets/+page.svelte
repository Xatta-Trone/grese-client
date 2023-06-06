<!-- @format -->
<script lang="ts">
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
  import type { PageData } from "./$types";
  import { superForm } from "sveltekit-superforms/client";
  import { enhance } from "$app/forms";
  import {
    Alert,
    Button,
    Helper,
    Input,
    Label,
    P,
    Select,
    Textarea,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  let textareaprops = {
    id: "words",
    name: "words",
    label: "Your message",
    rows: 4,
    placeholder: `abate, aberrant, abeyance, abscond, \nabstemious, admonish, adulterate, aesthetic`,
  };

  onMount(() => {
    console.log("mounted");
    console.log($page.url.searchParams.get('folder_id'))
  });

  export let data: PageData;
  //   select data
  let visibility = [
    { value: 1, name: "Everyone" },
    { value: 2, name: "Only me" },
  ];

  const { form, errors, constraints, message, delayed, submitting } = superForm(
    data.form,
    {
      resetForm: true,
      delayMs: 1,
      timeoutMs: 10,
    }
  );
</script>

<div class="mt-5">
  <SuperDebug data={$form} />
  {#if $delayed}<span class="delayed">Working...</span>{/if}
  {#if $submitting}<span class="delayed">Working2...</span>{/if}

  <P size="4xl" weight="medium">Create Set</P>

  <form method="POST" use:enhance class="mb-9">
    {#if $message}
      <Alert dismissable>
        {$message}
      </Alert>
    {/if}

    <div class="mb-6">
      <Label
        for="url"
        color={$errors.name ? "red" : undefined}
        class="block mb-2">Set Name</Label
      >
      <Input
        id="name"
        color={$errors.name ? "red" : undefined}
        placeholder="My awesome set"
        name="name"
        bind:value={$form.name}
        type="text"
        {...$constraints.name}
      />
      {#if $errors.name}
        <Helper class="mt-2" color="red">
          <span class="font-bold">{$errors.name}</span></Helper
        >{/if}
    </div>

    <div class="mb-6">
      <Label
        for="url"
        color={$errors.words ? "red" : undefined}
        class="block mb-2">Words</Label
      >
      <Textarea {...textareaprops} bind:value={$form.words} {...$constraints.words} />

      {#if $errors.words}
        <Helper class="mt-2" color="red">
          <span class="font-bold">{$errors.words}</span></Helper
        >{/if}
    </div>

    <div class="mb-6">
      <Label
        >Visible to
        <Select
          class="mt-2"
          name="visibility"
          items={visibility}
          bind:value={$form.visibility}
          {...$constraints.visibility}
        />
      </Label>
    </div>

    <Button type="submit">Create Set</Button>
  </form>
</div>
