<!-- @format -->
<script lang="ts">
  import { page } from "$app/stores";
  import PublicFolders from "$lib/components/user/PublicFolders.svelte";
  import PublicSets from "$lib/components/user/PublicSets.svelte";
  import bot from "$lib/images/bot.png";
  import { Avatar, Card, Heading, TabItem, Tabs } from "flowbite-svelte";
  import { fade } from "svelte/transition";
</script>

<svelte:head>
  <title>@{$page.params.username}: GRE SE</title>
</svelte:head>

<main class="my-6 flex items-center flex-col" in:fade>
  <!-- <div class="w-100">
    <Card img={bot} horizontal size="sm" padding="sm">
      <h5
        class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >
        {$page.params.username}'s Offerings
      </h5>
    </Card>
  </div> -->
  <Card size="md" padding="sm">
    <div class="flex flex-col items-center pb-4">
      <Avatar size="xl" src={bot} />
      <div class="my-5" />
      <Heading tag="h4">{$page.params.username}</Heading>
    </div>
  </Card>

  <div class="w-full">
    <Tabs style="underline" class="mt-5">
      <TabItem
        open={$page.url.searchParams.get("tab") != "folders"}
        title="Available Sets"
      >
        <PublicSets username={$page.params.username} />
      </TabItem>
      <TabItem
        open={$page.url.searchParams.get("tab") == "folders"}
        title="Available Set Folders"
      >
        <PublicFolders username={$page.params.username} />
      </TabItem>
    </Tabs>
  </div>
</main>
