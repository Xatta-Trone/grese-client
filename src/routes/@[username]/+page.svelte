<!-- @format -->
<script lang="ts">
  import { fade } from "svelte/transition";
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { Avatar, Card, Heading, TabItem, Tabs } from "flowbite-svelte";
  import bot from "$lib/images/bot.png";
  import PublicSets from "$lib/components/user/PublicSets.svelte";
  import PublicFolders from "$lib/components/user/PublicFolders.svelte";
</script>

<svelte:head>
  <title>@{$page.params.username}</title>
</svelte:head>

<main class="my-6 flex items-center flex-col" in:fade>
  <Card size="lg" padding="lg">
    <div class="flex flex-col items-center pb-4">
      <Avatar size="xl" src={bot} />
      <div class="my-5" />
      <Heading tag="h3">{$page.params.username}</Heading>
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
