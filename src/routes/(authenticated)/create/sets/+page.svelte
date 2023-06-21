<!-- @format -->
<script lang="ts">
  import {
    Alert,
    Button,
    Heading,
    Helper,
    Input,
    Label,
    P,
    Select,
    Textarea,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { z } from "zod";
  import DevComponent from "$lib/components/DevComponent.svelte";
  import CloseIcon from "$lib/icons/closeIcon.svelte";
  import axiosAPI from "$lib/services/customAxios";
  import type { AxiosResponse } from "axios";
  let textareaprops = {
    id: "words",
    name: "words",
    label: "Your message",
    rows: 4,
    placeholder: `abate, aberrant, abeyance, abscond, \nabstemious, admonish, adulterate, aesthetic`,
  };

  interface ListCreateResponse {
    data: Data;
    message: string;
  }

  interface Data {
    id: number;
    user_id: number;
    name: string;
    url: null | string;
    words: null | string;
    visibility: number;
    status: number;
    crated_at: Date;
    updated_at: Date;
  }

  interface ListCreateErrorResponse {
    errors?: Errors;
  }

  interface Errors {
    name?: string;
    url?: string;
    words?: string;
    visibility?: string;
  }

  interface FormData {
    name: string;
    visibility: number;
    words: string;
  }

  interface FormErrors {
    name?: string | null;
    visibility?: string | null;
    words?: string | null;
  }

  const schema = z.object({
    visibility: z.number().default(1),
    name: z.string().nonempty({ message: "Name is required." }),
    words: z.string().nonempty({ message: "Please enter at least 5 words." }),
  });

  // form errors
  let FormErrors: FormErrors = {
    name: null,
    visibility: null,
    words: null,
  };
  let folder_id: number | null = null;
  let formError: string | null = null;
  let formSuccess: string | null = null;

  // form data
  let formData: FormData = {
    name: "",
    visibility: 1,
    words: "",
  };

  let submitting = true;
  let resetForm: HTMLFormElement;

  onMount(() => {
    submitting = false;
    resetForm = <HTMLFormElement>document.getElementById("form");
    const tempFolderId: string | null = $page.url.searchParams.get("folder_id");
    folder_id = tempFolderId ? parseInt(tempFolderId) : null;
  });

  //   select data
  let visibility = [
    { value: 1, name: "Everyone" },
    { value: 2, name: "Only me" },
  ];

  async function handleSubmit() {
    submitting = true;
    // first clear the errors
    resetFormErrors();
    const result = schema.safeParse(formData);
    console.log(result);

    if (!result.success) {
      const formatted = result.error.format();
      console.log(formatted);
      // now set the errors
      FormErrors.name = formatted.name?._errors[0] ?? null;
      FormErrors.visibility = formatted.visibility?._errors[0] ?? null;
      FormErrors.words = formatted.words?._errors[0] ?? null;
    } else {
      // check the word length
      let words: string[] = [];

      result.data.words.split("\n").forEach((wordLine) => {
        wordLine.split(",").forEach((word) => {
          words.push(word);
        });
      });

      if (new Set(words).size < 5) {
        FormErrors.words = "Please enter at least 5 unique words.";
        submitting = false;
        return;
      }

      // now proceed to submit

      await axiosAPI
        .post("/lists", { ...result.data, scope: "user", folder_id })
        .then((res: AxiosResponse) => {
          if (res.status == 201) {
            resetForm.reset();
            const responseData: ListCreateResponse = res.data;
            formSuccess = responseData.message;
          } else {
            formError = "Some error occurred.";
          }
        })
        .catch((err) => {
          if (err.response?.status == 422) {
            // validation error
            const d: ListCreateErrorResponse = err.response.data;

            if (d.errors?.name) {
              FormErrors.name = d.errors.name;
            }
            if (d.errors?.visibility) {
              FormErrors.visibility = d.errors.visibility;
            }
            if (d.errors?.words) {
              FormErrors.words = d.errors.words;
            }
          } else {
            formError = err.response.data.errors;
          }
        })
        .finally(() => {
          submitting = false;
        });
    }

    submitting = false;
  }

  function resetFormErrors() {
    FormErrors.name = null;
    FormErrors.visibility = null;
    FormErrors.words = null;
    formError = null;
  }
</script>

<div class="mt-5">
  <DevComponent>
    <p>Name: {formData.name}</p>
    <p>visibility: {formData.visibility}</p>
    <p>words: {formData.words}</p>
  </DevComponent>
  <div class="my-3">
    <Heading tag="h4">Create Set</Heading>
  </div>

  {#if formError}
    <Alert color="red" dismissable class="my-1">
      <span slot="icon"><CloseIcon /></span>
      {formError}
    </Alert>
  {/if}

  {#if formSuccess}
    <Alert color="green" dismissable class="my-1">
      <span slot="icon"><CloseIcon /></span>
      {formSuccess}
    </Alert>
  {/if}

  <form id="form" on:submit|preventDefault={handleSubmit} class="mb-9">
    <div class="mb-6">
      <Label
        for="url"
        color={FormErrors.name ? "red" : undefined}
        class="block mb-2">Set Name</Label
      >
      <Input
        id="name"
        color={FormErrors.name ? "red" : undefined}
        placeholder="My awesome set"
        name="name"
        bind:value={formData.name}
        type="text"
      />
      {#if FormErrors.name}
        <Helper class="mt-2" color="red">
          {FormErrors.name}</Helper
        >{/if}
    </div>

    <div class="mb-6">
      <Label
        for="url"
        color={FormErrors.words ? "red" : undefined}
        class="block mb-2">Words</Label
      >
      <Textarea {...textareaprops} bind:value={formData.words} />
      <Helper>At least 5 words required.</Helper>

      {#if FormErrors.words}
        <Helper class="mt-2" color="red">
          {FormErrors.words}</Helper
        >{/if}
    </div>

    <div class="mb-6">
      <Label
        >Visible to
        <Select
          class="mt-2"
          name="visibility"
          items={visibility}
          bind:value={formData.visibility}
        />
      </Label>
      {#if FormErrors.visibility}
        <Helper class="mt-2" color="red">
          {FormErrors.visibility}</Helper
        >{/if}
    </div>

    <Button type="submit" disabled={submitting}>Create Set</Button>
  </form>
</div>
