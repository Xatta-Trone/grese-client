<!-- @format -->
<script lang="ts">
  import { page } from "$app/stores";
  import DevComponent from "$lib/components/DevComponent.svelte";
  import CloseIcon from "$lib/icons/closeIcon.svelte";
  import bot from "$lib/images/bot.png";
  import type {
    Folder,
    List as FolderList,
    Meta,
    SingleFolderResponse,
  } from "$lib/interfaces/folderResponse";

  import FolderListsComponent from "$lib/components/user/folders/FolderListsComponent.svelte";
  import axiosAPI from "$lib/services/customAxios";
  import type { AxiosResponse } from "axios";
  import {
    Alert,
    Avatar,
    Button,
    Card,
    Heading,
    Helper,
    Input,
    Label,
    Modal,
    Select,
    TextPlaceholder,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { inview } from "svelte-inview";
  import { z } from "zod";
  import type { PageData } from "./$types";

  export let data: PageData;

  // data variables
  let currentPage = 1;
  let per_page = 30;
  let lists: FolderList[] = [];
  let newLists: FolderList[] = [];
  let meta: Meta;
  let folderMeta: Folder;
  let loading = false;
  let hasMore = true;
  let query: string = "";
  let orderBy = "id";
  let orderDir = "asc";

  // fetch data
  async function fetchData() {
    if (loading || !hasMore) return;
    await axiosAPI
      .get(
        `/folders/${$page.params.id}?page=${currentPage}&per_page=${per_page}&query=${query}&order_by=${orderDir}&order=${orderBy}`
      )
      .then((res) => {
        const data: SingleFolderResponse = res.data;
        // console.log(data);
        if (meta == undefined) {
          meta = data.meta;
        }
        if (folderMeta == undefined) {
          folderMeta = data.folder;
          formData.name = folderMeta.name;
          formData.visibility = folderMeta.visibility;
        }

        if (data.lists.length) {
          lists = [...lists, ...data.lists];
          hasMore = data.lists.length < per_page ? false : true;
        } else {
          hasMore = false;
        }
      })
      .finally(() => (loading = false));
  }

  function loadMore() {
    if (!hasMore) return;
    currentPage++;
    fetchData();
  }

  onMount(() => {
    fetchData();
    submitting = false;
  });

  // =========================
  // set save function
  // =========================
  let saving = false;
  let saveSuccess: string | null = null;
  let saveError: string | null = null;

  //   ===========================
  //  Folder update handler
  //   ===========================
  interface FolderCreateErrorResponse {
    errors?: Errors;
  }

  interface Errors {
    name?: string;
    visibility?: string;
  }

  interface FormData {
    name: string;
    visibility: number;
  }

  interface FormErrors {
    name?: string | null;
    visibility?: string | null;
  }

  const schema = z.object({
    name: z.string().nonempty({
      message: "Folder name is required.",
    }),
    visibility: z.number().default(1),
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
      // now set the errors
      // now submit the data
      console.log("data submit");
      console.log(result.data);

      await axiosAPI
        .put(`/folders/${$page.params.id}`, result.data)
        .then((res: AxiosResponse) => {
          if (res.status == 204) {
            formSuccess = "Update success.";
          } else {
            formError = "Some error occurred.";
          }
        })
        .catch((err) => {
          if (err.response?.status == 422) {
            // validation error
            const d: FolderCreateErrorResponse = err.response.data;
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
  }

  let defaultModal = false;
</script>

<svelte:head>
  <title>Edit Folder</title>
</svelte:head>

<main class="my-6">
  <DevComponent>
    <p>Name: {formData.name}</p>
    <p>visibility: {formData.visibility}</p>
  </DevComponent>
  <div class="my-3">
    <Heading tag="h4">Update Folder</Heading>
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

  <form id="form" on:submit|preventDefault={handleSubmit} class="mb-9 mt-3">
    <div class="mb-6">
      <Label
        for="name"
        class="block mb-2"
        color={FormErrors.name ? "red" : undefined}>Folder Name</Label
      >
      <Input
        id="name"
        required
        placeholder="GregMat Vocabulary Lists"
        color={FormErrors.name ? "red" : undefined}
        name="name"
        bind:value={formData.name}
        type="text"
      />
      {#if FormErrors.name}
        <Helper class="mt-2 text-sm" helperClass="text-lg" color="red">
          {FormErrors.name}
        </Helper>
      {/if}
      {#if FormErrors.visibility}
        <Helper class="mt-2" color="red">
          {FormErrors.visibility}
        </Helper>
      {/if}
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
    </div>

    <Button type="submit" disabled={submitting}>Update Folder</Button>
  </form>

  <div class="my-3">
    <Heading tag="h4">{lists.length} set(s) in this folder</Heading>
  </div>

  <div class="mt-5 mb-5">
    <Button href="/create/sets?folder={folderMeta?.id}">Create a new set</Button
    >
    <Button on:click={() => (defaultModal = true)}>Add an existing set</Button>
  </div>

  {#each lists as set}
    <Card size="xl" href="/sets/{set.id}-{set.slug}" class="mb-3">
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        {set.name}
      </h5>
      <div class="flex justify-between mt-2">
        <a class="flex items-center space-x-4" href="/@{set.user.username}">
          <Avatar src={bot} size="xs" />
          <div class="space-y-1 font-medium dark:text-white">
            <div>{set.user.username}</div>
          </div>
        </a>
        <div>{set.word_count} {set.word_count > 1 ? "words" : "word"}</div>
      </div>
    </Card>
  {/each}

  {#if lists.length > 0 && !hasMore}
    <Heading tag="h6" color="text-gray-600 dark:text-white"
      >End of results &#128522;</Heading
    >
  {/if}

  <div use:inview={{}} on:change={loadMore} />

  {#if loading}
    {#each Array(10) as _, index (index)}
      <TextPlaceholder size="xxl" class="mt-8" />
    {/each}
  {/if}

  {#if lists.length == 0 && !hasMore && !loading}
    <Heading tag="h5">Nothing found. &#128532;</Heading>
  {/if}
</main>

<Modal
  title={folderMeta?.name}
  bind:open={defaultModal}
>
  {#if folderMeta}
    <FolderListsComponent {folderMeta} />
  {/if}
</Modal>
