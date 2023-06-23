<!-- @format -->
<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import DevComponent from "$lib/components/DevComponent.svelte";
  import CloseIcon from "$lib/icons/closeIcon.svelte";
  import type { BadStatusErrorResponse } from "$lib/interfaces/common";
  import type {
    ListMeta,
    Meta,
    SingleSetResponse,
    Word,
  } from "$lib/interfaces/setData";
  import axiosAPI from "$lib/services/customAxios";
  import type { AxiosError, AxiosResponse } from "axios";
  import {
    Alert,
    Badge,
    Button,
    Heading,
    Helper,
    Input,
    Label,
    Select,
    Skeleton,
    Textarea,
  } from "flowbite-svelte";
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { z } from "zod";
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
    FormErrors.words = null;
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

  enum wordUpdateType {
    WORD_ID = 1,
    WORDS,
  }

  let handleWordUpdateType: wordUpdateType | null = null;

  function handleDismiss(word: Word) {
    console.log(word);
    if (browser) {
      localStorage.setItem("lastWord", JSON.stringify(word));
    }
    deleteWordById(word);
  }

  function undoWordDelete(): void {
    // get the word from local storage
    const wordData = localStorage.getItem("lastWord");

    if (wordData == null) {
      wordError = "Could not get the last word data";
      return;
    }

    // parse the word
    const word: Word = JSON.parse(wordData);

    // now update the data
    updateWords(wordUpdateType.WORD_ID, word);
  }

  function handleUpdateWords() {
    const words = wordTextArea.trim();
    // now update the data
    updateWords(wordUpdateType.WORDS, null, words);
  }

  //   send the delete request
  let wordError: string | null = null;
  let wordSuccess: string | null = null;

  function deleteWordById(word: Word) {
    handleWordUpdateType = null;
    wordError = null;
    wordSuccess = null;
    axiosAPI
      .delete(`/lists-word/${$page.params.id}?word_id=${word.id}`)
      .then(() => {
        words = [...words.filter(w => w.id != word.id)];
        wordSuccess = `Word ${word.word} deleted.`;
      })
      .catch((err: AxiosError) => {
        if (err.response?.status && err.response.status >= 400) {
          const errData: BadStatusErrorResponse | any = err.response.data;
          wordError = errData.errors;
        }
      });
  }

  // ==============================
  // handle update word
  // ==============================
  let wordTextArea: string = "";
  let wordsSubmitting = false;
  function updateWords(
    updateType: wordUpdateType,
    word: Word | null = null,
    wordData: string = ""
  ) {
    handleWordUpdateType = updateType;
    // reset errors
    wordSuccess = null;
    wordError = null;
    FormErrors.words = null;
    wordsSubmitting = true;

    // construct the data
    const wordsRegex = /^[a-zA-Z,\n]+$/;

    if (wordData != "" && wordsRegex.test(wordData) == false) {
      FormErrors.words = "Words not valid.";
      return;
    }
    // construct the data
    let data = {};
    if (word != null) {
      Object.assign(data, { word_id: word.id });
    }
    if (wordData != "") {
      Object.assign(data, { words: wordData });
    }

    console.log(data);

    // now submit the data
    axiosAPI
      .post(`/lists-word/${$page.params.id}`, data)
      .then((res: AxiosResponse) => {
        if (res.status == 204) {
          wordSuccess =
            handleWordUpdateType == wordUpdateType.WORD_ID
              ? `Word ${word?.word} restored.`
              : "Words added and now under processing...Please check back after some times.";
          // restore the word
          if (handleWordUpdateType == wordUpdateType.WORD_ID && word != null) {
            words = [...words, word];
          }
          if (handleWordUpdateType == wordUpdateType.WORDS) {
            wordTextArea = "";
          }
        } else {
          wordError = "Error undo/updating word(s).";
        }
      })
      .catch((err: AxiosError) => {
        if (err.response && err.response?.status == 422) {
          // validation error
          const data: any = err.response.data;
          // json parse the data
          alert(JSON.stringify(data.errors));
          return;
        }

        if (err.response?.status && err.response.status >= 400) {
          const errData: BadStatusErrorResponse | any = err.response.data;
          wordError = errData.errors;
        } else {
          wordError = err.response?.statusText ?? "Unknown error occurred";
        }
      })
      .finally(() => {
        wordsSubmitting = false;
      });
  }

  onDestroy(() => {
    // if (browser) {
    //   localStorage.removeItem("lastWord");
    // }
  });
</script>

<svelte:head>
  <title>{listMeta ? `Edit Set: ${listMeta.name}` : "Edit Set"}</title>
</svelte:head>

<main class="my-6" in:fade>
  <DevComponent>
    {JSON.stringify(formData)}
  </DevComponent>

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
    <Heading tag="h4">Edit words [{words.length ?? 0} total]</Heading>
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
        {#if handleWordUpdateType == null}
          <Alert color="green" dismissable class="my-1">
            <span slot="icon"><CloseIcon /></span>
            {wordSuccess}
            <Button size="xs" color="dark" on:click={undoWordDelete}
              >Undo</Button
            >
          </Alert>
        {:else}
          <Alert color="green" dismissable class="my-1">
            <span slot="icon"><CloseIcon /></span>
            {wordSuccess}
          </Alert>
        {/if}
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
        <Textarea {...textareaprops} bind:value={wordTextArea} />
        {#if FormErrors.words}
          <Helper class="mt-2" color="red">
            {FormErrors.words}</Helper
          >{/if}
        <Button
          disable={wordsSubmitting}
          on:click={handleUpdateWords}
          class="mt-3"
          type="submit">Add new words</Button
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
