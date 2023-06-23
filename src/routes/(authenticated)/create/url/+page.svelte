<!-- @format -->
<script lang="ts">
  import DevComponent from "$lib/components/DevComponent.svelte";
  import CloseIcon from "$lib/icons/closeIcon.svelte";
  import axiosAPI from "$lib/services/customAxios.js";
  import type { AxiosResponse } from "axios";
  import {
    A,
    Alert,
    Button,
    Heading,
    Helper,
    Input,
    Label,
    P,
    Select,
  } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { z } from "zod";

  export let data; // : PageData
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

  interface FormData {
    url: string;
    visibility: number;
  }

  interface FormErrors {
    url?: string | null;
    visibility?: string | null;
  }

  interface ListCreateResponse {
    data: Data;
    message: string;
  }

  interface Data {
    id: number;
    user_id: number;
    name: string;
    url: string;
    words: null;
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

  const schema = z.object({
    url: z
      .string()
      .nonempty({
        message: "URL is required.",
      })
      .url(),
    visibility: z.number().default(1),
  });

  // form errors
  let FormErrors: FormErrors = {
    url: null,
    visibility: null,
  };
  let formError: string | null = null;
  let formSuccess: string | null = null;

  // form data
  let formData: FormData = {
    url: "",
    visibility: 1,
  };
  let submitting = true;
  let resetForm: HTMLFormElement;

  onMount(() => {
    submitting = false;
    resetForm = <HTMLFormElement>document.getElementById("form");
  });

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
      FormErrors.url = formatted.url?._errors[0] ?? null;
      FormErrors.visibility = formatted.visibility?._errors[0] ?? null;
    } else {
      // now set the errors
      // now submit the data
      console.log("data submit");
      console.log(result.data);

      await axiosAPI
        .post("/lists", {
          ...result.data,
          name: "Import data",
          scope: "user",
        })
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

            if (d.errors?.url) {
              FormErrors.url = d.errors.url;
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
    FormErrors.url = null;
    FormErrors.visibility = null;
    formError = null;
  }
</script>

<div class="mt-5" in:fade>
  <DevComponent>
    <p>URL: {formData.url}</p>
    <p>visibility: {formData.visibility}</p>
  </DevComponent>

  <div class="my-3">
    <Heading tag="h4">Import words</Heading>
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

  {#if data?.user && data.user?.expires_on == null}
    <Alert color="yellow" class="my-5">
      <P
        >Please upgrade to premium to access this feature <A href="/profile"
          >from here</A
        ></P
      >
    </Alert>
  {:else}
    <form id="form" on:submit|preventDefault={handleSubmit} class="mb-9">
      <Alert color="yellow" class="mb-3">
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
        >. Simply copy and paste the URL of the set or folder you want to
        import, and we'll take care of the rest for you.
      </Alert>

      <div class="mb-6">
        <Label
          for="url"
          color={FormErrors.url ? "red" : undefined}
          class="block mb-2">URL</Label
        >
        <Input
          id="url"
          color={FormErrors.url ? "red" : undefined}
          placeholder="https://quizlet.com/saint1729/folders/gregmat/sets"
          name="url"
          bind:value={formData.url}
          type="url"
        />
        {#if FormErrors.url}
          <Helper class="mt-2" color="red">
            {FormErrors.url}</Helper
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
      </div>

      <Button type="submit" disabled={submitting}>Import data</Button>
    </form>
  {/if}
</div>

<style>
</style>
