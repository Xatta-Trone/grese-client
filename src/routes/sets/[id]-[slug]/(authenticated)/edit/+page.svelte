<!-- @format -->
<script lang="ts">
  import { page } from "$app/stores";
  import {
    Alert,
    Badge,
    Button,
    ButtonGroup,
    Heading,
    Helper,
    Input,
    Label,
    Modal,
    P,
    Select,
    Skeleton,
    Textarea,
    Toggle,
  } from "flowbite-svelte";
  import axiosAPI from "$lib/services/customAxios";
  import { onDestroy, onMount } from "svelte";
  import SettingsIcon from "$lib/icons/settingsIcon.svelte";
  import DevComponent from "$lib/components/DevComponent.svelte";
  import type {
    ListMeta,
    Meta,
    PartsOfSpeech,
    SingleSetResponse,
    Word,
  } from "$lib/interfaces/setData";
  import { fade } from "svelte/transition";
  import { z } from "zod";
  import type { AxiosError, AxiosResponse } from "axios";
  import CloseIcon from "$lib/icons/closeIcon.svelte";
  import type { BadStatusErrorResponse } from "$lib/interfaces/common";
  let textareaprops = {
    id: "words",
    name: "words",
    label: "Your message",
    rows: 4,
    placeholder: `abate, aberrant, abeyance, abscond, \nabstemious, admonish, adulterate, aesthetic`,
  };
  interface ListCreateErrorResponse {
    errors?: Errors;
  }
  interface Errors {
    name?: string;
    url?: string;
    words?: string;
    visibility?: string;
  }

  interface FormErrors {
    name?: string | null;
    visibility?: string | null;
    words?: string | null;
  }

  interface FormData {
    name: string;
    visibility: number;
  }

  const schema = z.object({
    visibility: z.number().default(1),
    name: z.string().nonempty({
      message: "Name is required.",
    }),
  });

  // form errors
  let FormErrors: FormErrors = {
    name: null,
    visibility: null,
    words: null,
  };
  let formError: string | null = null;
  let formSuccess: string | null = null;

  // form data
  let formData: FormData = {
    name: "",
    visibility: 1,
  };

  let submitting = true;
  let resetForm: HTMLFormElement;

  onMount(() => {
    submitting = false;
    resetForm = <HTMLFormElement>document.getElementById("form");
  });

  //   select data
  let visibility = [
    {
      value: 1,
      name: "Everyone",
    },
    {
      value: 2,
      name: "Only me",
    },
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
    } else {
      // now proceed to submit

      await axiosAPI
        .put(`/lists/${$page.params.id}`, {
          ...result.data,
        })
        .then((res: AxiosResponse) => {
          if (res.status == 204) {
            formSuccess = "Updated";
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
    formError = null;
    formSuccess = null;
  }

  // =============================
  //   get the form data
  // =============================

  // data variables
  let currentPage = 1;
  let per_page = 50;
  let words: Word[] = [];
  let backupWords: Word[] = [];
  let newWords: Word[] = [];
  let listMeta: ListMeta;
  let meta: Meta;
  let loading = false;
  let hasMore = true;
  let query: string = "";

  $: words = [...words, ...newWords];

  // fetch data
  async function fetchData() {
    if (loading || !hasMore) return;
    loading = true;
    await axiosAPI
      .get(
        `/lists/${$page.params.id}?page=${currentPage}&per_page=${per_page}&query=${query}&order_by=asc`
      )
      .then((res) => {
        const data: SingleSetResponse = res.data;
        console.log(data);
        if (meta == undefined) {
          meta = data.meta;
        }

        if (listMeta == undefined) {
          listMeta = data.list_meta;
          formData.name = listMeta.name;
          formData.visibility = listMeta.visibility;
        }

        if (data.words.length) {
          words = [...words, ...data.words];
          // newWords = data.words;
          backupWords = [...backupWords, ...data.words];
          hasMore = data.words.length >= per_page ? true : false;
        } else {
          hasMore = false;
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        loading = false;
        // call for next

        return loadMore();
      });
  }

  function loadMore() {
    if (loading || !hasMore) return;
    currentPage++;
    fetchData();
  }

  onMount(async () => {
    await fetchData();
  });

  // ==============================
  // handle delete words
  // ==============================

  function handleDismiss(word: Word) {
    console.log(word);
    localStorage.setItem("lastWord", JSON.stringify(word));
    deleteWordById(word.id);
  }

  //   send the delete request
  let wordError: string | null = null;
  let wordSuccess: string | null = null;

  function deleteWordById(id: number) {
    wordError = null;
    wordSuccess = null;
    axiosAPI
      .delete(`/lists-word/${$page.params.id}?word_id=${id}`)
      .then(() => {
        wordSuccess = "Word deleted.";
      })
      .catch((err: AxiosError) => {
        if (err.response?.status && err.response.status >= 400) {
          const errData: BadStatusErrorResponse | any = err.response.data;
          wordError = errData.errors;
        }
      });
  }

  onDestroy(() => {
    localStorage.removeItem("lastWord");
  });
</script>

<svelte:head>
  <title>{listMeta ? `Edit Set: ${listMeta.name}` : "Edit Set"}</title>
</svelte:head>

<main class="my-6" in:fade>
  <DevComponent />

  <div class="my-3">
    <Heading tag="h4">Edit Set Metadata</Heading>
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

  {#if listMeta}
    <form
      id="form"
      on:submit|preventDefault={handleSubmit}
      class="mb-9 border border-primary-300 px-2 py-3"
    >
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
      <Button disable={submitting} type="submit">Update</Button>
    </form>
  {/if}

  <div class="my-3">
    <Heading tag="h4">Edit words</Heading>
  </div>

  {#if words.length > 0}
    <div class="border border-primary-300 px-2 py-3">
      {#if wordError}
        <Alert color="red" dismissable class="my-1">
          <span slot="icon"><CloseIcon /></span>
          {wordError}
        </Alert>
      {/if}

      {#if wordSuccess}
        <Alert color="green" dismissable class="my-1">
          <span slot="icon"><CloseIcon /></span>
          {wordSuccess}
        </Alert>
      {/if}
      {#each words as word}
        <Badge
          dismissable
          large
          class="ml-2 mt-2"
          on:dismiss={() => handleDismiss(word)}>{word.word}</Badge
        >
      {/each}

      <div class="mb-2 mt-5">
        <Label
          for="url"
          color={FormErrors.words ? "red" : undefined}
          class="block mb-2">Add new words</Label
        >
        <Textarea {...textareaprops} />
        {#if FormErrors.words}
          <Helper class="mt-2" color="red">
            {FormErrors.words}</Helper
          >{/if}
        <Button disable={submitting} class="mt-3" type="submit"
          >Add new words</Button
        >
      </div>
    </div>
  {/if}

  {#if loading && words.length == 0}
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
  {/if}
</main>
