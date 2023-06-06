<!-- @format -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import {
    Label,
    Helper,
    Input,
    Button,
    Alert,
    P,
    Select,
  } from "flowbite-svelte";

  import type { PageData } from "./$types";
  import { superForm } from "sveltekit-superforms/client";
  import SuperDebug from "sveltekit-superforms/client/SuperDebug.svelte";
  import { boolean } from "zod";

  export let data: PageData; // : PageData

  //   select data
  let visibility = [
    { value: 1, name: "Everyone" },
    { value: 2, name: "Only me" },
  ];

  const { form, submitting, delayed, timeout, message, errors, constraints } =
    superForm(data.form, {
      resetForm: true,
      onResult: (event) => {
        console.log(event)
      },
      
    });
    function test() {
      console.log('test')
    }


</script>

<div class="mt-5">
  <SuperDebug data={$form} />
  <P size="4xl" weight="medium">Create Folder</P>
  {$submitting}
  {$delayed}
  {$timeout}

  <form method="POST" use:enhance class="mb-9 mt-3">
    {#if $message}
      <Alert dismissable>
        {$message}
      </Alert>
    {/if}

    <div class="mb-6">
      <Label
        for="url"
        color={$errors.name ? "red" : undefined}
        class="block mb-2">Folder Name</Label
      >
      <Input
        id="name"
        color={$errors.name ? "red" : undefined}
        placeholder="GregMat Vocabulary Lists"
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

    <Button type="submit">Create Folder</Button>
  </form>
</div>
