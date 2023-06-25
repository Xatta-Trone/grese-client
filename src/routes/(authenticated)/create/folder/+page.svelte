<!-- @format -->
<script lang="ts">
  import {
    Alert,
    Button,
    Heading,
    Helper,
    Input,
    Label,
    Select,
  } from "flowbite-svelte";
  import { z } from "zod";

  import DevComponent from "$lib/components/DevComponent.svelte";
  import CloseIcon from "$lib/icons/closeIcon.svelte";
  import axiosAPI from "$lib/services/customAxios";
  import type { AxiosResponse } from "axios";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  interface FormData {
    name: string;
    visibility: number;
  }

  interface FormErrors {
    name?: string | null;
    visibility?: string | null;
  }

  interface FolderCreateSuccessResponse {
    data: Data;
    message: string;
  }

  interface Data {
    id: number;
    user_id: number;
    list_meta_id: null;
    name: string;
    slug: string;
    visibility: number;
    status: number;
    crated_at: Date;
    updated_at: Date;
  }

  interface FolderCreateErrorResponse {
    errors?: Errors;
  }

  interface Errors {
    name?: string;
    visibility?: string;
  }

  const schema = z.object({
    name: z.string().nonempty({ message: "Folder name is required." }),
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

  onMount(() => {
    submitting = false;
    resetForm = <HTMLFormElement>document.getElementById("form");
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
    } else {
      // now set the errors
      // now submit the data
      console.log("data submit");
      console.log(result.data);

      await axiosAPI
        .post("/folders", result.data)
        .then((res: AxiosResponse) => {
          if (res.status == 201) {
            resetForm.reset();
            const responseData: FolderCreateSuccessResponse = res.data;
            formSuccess = responseData.message;
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
</script>

<svelte:head>
  <title>Create Folder: GRE SE</title>
</svelte:head>


<div class="mt-5" in:fade>
  <DevComponent>
    <p>Name: {formData.name}</p>
    <p>visibility: {formData.visibility}</p>
  </DevComponent>
  <div class="my-3">
    <Heading tag="h4">Create Folder</Heading>
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

    <Button type="submit" disabled={submitting}>Create Folder</Button>
  </form>
</div>
