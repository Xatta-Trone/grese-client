<!-- @format -->
<script lang="ts">
  import type {
    NotificationData,
    NotificationMeta,
    NotificationsResponse,
  } from "$lib/interfaces/notification";
  import axiosAPI from "$lib/services/customAxios";
  import { timeSince } from "$lib/utils/helpers";
  import { Alert, Button, Heading, Skeleton } from "flowbite-svelte";
  import { inview } from "svelte-inview/dist/index";

  // data variables
  let currentPage = 0;
  let per_page = 20;
  let notifications: NotificationData[] = [];
  let notificationMeta: NotificationMeta;
  let loading = false;
  let markAsLoading = false;
  let hasMore = true;

  async function fetchData() {
    loading = true;
    await axiosAPI
      .get(`/notifications?page=${currentPage}&per_page=${per_page}`)
      .then((res) => {
        const data: NotificationsResponse = res.data;

        if (notificationMeta == undefined) {
          notificationMeta = data.meta;
        }

        if (data.data.length) {
          notifications = [...notifications, ...data.data];
          hasMore = data.data.length < per_page ? false : true;
        } else {
          hasMore = false;
        }
      })
      .catch((error) => {
        alert(JSON.stringify(error.response.data.errors));
      })
      .finally(() => (loading = false));
  }

  function loadMore() {
    if (loading || !hasMore) return;
    currentPage++;
    fetchData();
  }

  async function markAsRead() {
    markAsLoading = true;
    await axiosAPI
      .get(`/notifications-mar`)
      .then(() => {
        notifications = notifications.map((notification) => {
          return { ...notification, read_at: new Date() };
        });
      })
      .catch((error) => {
        alert(JSON.stringify(error.response.data.errors));
      })
      .finally(() => (markAsLoading = false));
  }
</script>

<svelte:head>
  <title>Activities: GRE SE</title>
</svelte:head>

<main class="">
  <div class="my-3 flex justify-between items-center">
    <Heading tag="h4">Activities</Heading>
    <div>
      <Button
        disabled={markAsLoading || notifications.length == 0}
        on:click={markAsRead}
        size="sm">Mark all read</Button
      >
    </div>
  </div>

  {#each notifications as notification}
    <Alert color={notification.read_at == null ? "blue" : "dark"} class="mb-3">
      <div class="flex justify-between content-center">
        <div>
          <span class="font-medium"
            >{timeSince(new Date(notification.created_at))} ago</span
          >
        </div>
        <div class="flex-1 ml-3">
          {notification.content}{notification.content}
        </div>
      </div>
    </Alert>
  {/each}

  {#if loading}
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
    <Skeleton size="xxl" class="mt-8 mb-2.5" />
  {/if}

  {#if notifications.length == 0 && !hasMore && !loading}
    <Heading tag="h5">Nothing found. &#128532;</Heading>
  {/if}

  <div use:inview={{}} on:change={loadMore} />
</main>
