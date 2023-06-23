<!-- @format -->
<script lang="ts">
  import CircleCheckIcon from "$lib/icons/circleCheckIcon.svelte";
  import CircleXIcon from "$lib/icons/circleXIcon.svelte";
  import { Button, Card, Heading } from "flowbite-svelte";
</script>

<div class="text-center">
  <Heading
    tag="h3"
    class="mb-10 mt-10"
    customSize="text-4xl font-extrabold  md:text-5xl lg:text-6xl"
    >Pricing Plans</Heading
  >
</div>

<div class="grid gap-4 grid-cols-3 mb-20">
  <Card padding="sm">
    <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
      FREE
    </h5>
    <div class="flex items-baseline text-gray-900 dark:text-white">
      <span class="text-3xl font-semibold">$</span>
      <span class="text-5xl font-extrabold tracking-tight">0</span>
      <span class="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400"
        >/month</span
      >
    </div>
    <!-- List -->
    <ul class="my-7 space-y-4">
      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
           Word list access: top 300
        </span>
      </li>
      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          10 Sets (including saved)
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          1 Set group (including saved)
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          Access to 3/4 practice modules
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleXIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          Self customized word list
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleXIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          Limited practice modules
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleXIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          Priority support
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleXIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          All future updates
        </span>
      </li>
    </ul>
    <Button class="w-full" href="/profile">Choose plan</Button>
  </Card>

   <Card padding="sm">
    <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
      PLUS
    </h5>
    <div class="flex items-baseline text-gray-900 dark:text-white">
      <span class="text-3xl font-semibold">$</span>
      <span class="text-5xl font-extrabold tracking-tight">5</span>
      <span class="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400"
        >/5 months</span
      >
    </div>
    <!-- List -->
    <ul class="my-7 space-y-4">
      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          Word list access: ALL words
        </span>
      </li>
      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          <span class="">Unlimited</span> sets
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          <span>Unlimited</span> set groups
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          Access to all practice modules
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleXIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          Self customized word list
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          Limited practice modules
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          Priority support
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleXIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          All future updates
        </span>
      </li>
    </ul>
    <Button class="w-full" href="/profile">Choose plan</Button>
  </Card>

    <Card padding="sm">
    <h5 class="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
      PLUS
    </h5>
    <div class="flex items-baseline text-gray-900 dark:text-white">
      <span class="text-3xl font-semibold">$</span>
      <span class="text-5xl font-extrabold tracking-tight">10</span>
      <span class="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400"
        >/5 months</span
      >
    </div>
    <!-- List -->
    <ul class="my-7 space-y-4">
      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          Word list access: ALL words
        </span>
      </li>
      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          <span class="">Unlimited</span> sets
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          <span>Unlimited</span> set groups
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          Access to all practice modules
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          Self customized word list
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          Unlimited practice modules
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          Priority support
        </span>
      </li>

      <li class="flex space-x-2">
        <CircleCheckIcon />
        <span
          class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400"
        >
          All future updates
        </span>
      </li>
    </ul>
    <Button class="w-full" >Under development</Button>
  </Card>

</div>
