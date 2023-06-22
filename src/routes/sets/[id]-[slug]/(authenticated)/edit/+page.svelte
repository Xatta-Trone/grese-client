<!-- @format -->
<script lang="ts">
  import { page } from "$app/stores";
  import {
    Alert,
    Button,
    ButtonGroup,
    Heading,
    Helper,
    Input,
    Label,
    Modal,
    P,
    Select,
    Textarea,
    Toggle,
  } from "flowbite-svelte";
  import axiosAPI from "$lib/services/customAxios";
  import { onMount } from "svelte";
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
  import type { AxiosResponse } from "axios";
  import CloseIcon from "$lib/icons/closeIcon.svelte";
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
        .put(`/lists/${$page.params.id}`, { ...result.data })
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
          // to prevent the errors occurring from null parts of speech
          const filteredWords = data.words.filter(
            (word) => word.word_data.partsOfSpeeches != null
          );
          words = [...words, ...filteredWords];
          // newWords = data.words;
          backupWords = [...backupWords, ...filteredWords];
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

      <Button type="submit">Update</Button>
    </form>
  {/if}

  {#if loading && words.length == 0}
    <Heading tag="h5">Loading...&#128516;</Heading>
  {/if}
</main>
