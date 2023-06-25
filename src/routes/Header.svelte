<!-- @format -->
<script lang="ts">
  import { page } from "$app/stores";
  import { logout } from "$lib/services/auth";
  import {
    Button,
    Chevron,
    DarkMode,
    Dropdown,
    DropdownItem,
    Navbar,
    NavBrand,
    NavHamburger,
    NavLi,
    NavUl,
  } from "flowbite-svelte";
  export let isLoggedIn: boolean
  let btnClass =
    "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-md";
</script>

<Navbar let:hidden let:toggle color="form">
  <NavBrand href="/">
    <span
      class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
    >
      GRE SE
    </span>
  </NavBrand>
  <div class="flex md:order-2 content-center">
    <DarkMode initialTheme="light" {btnClass} class="mr-2" />

    {#if isLoggedIn}
      <div id="profile" class="cursor-pointer ml-4">
        <Chevron aligned>Profile</Chevron>
      </div>
      <Dropdown triggeredBy="#profile" class="w-44 z-20">
        <DropdownItem slot="header">
          <a href="/profile">My profile</a>
        </DropdownItem>
        <DropdownItem slot="footer">
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a href="#" on:click={() => logout()}>Logout</a>
        </DropdownItem>
      </Dropdown>
    {:else}
      <div>
        <Button href="/login" size="sm">Login</Button>
      </div>
    {/if}

    <NavHamburger on:click={toggle} />
  </div>
  <NavUl {hidden} class="order-1">
    <NavLi href="/" active={$page.url.pathname == "/" ? true : false}>
      Home
    </NavLi>
    <NavLi
      href="/pricing"
      active={$page.url.pathname == "/pricing" ? true : false}
    >
      Pricing
    </NavLi>
    <NavLi
      id="library"
      class="cursor-pointer"
      active={$page.url.pathname == "/sets" || $page.url.pathname == "/sets"
        ? true
        : false}
    >
      <Chevron aligned>Library</Chevron>
    </NavLi>

    <NavLi
      id="create"
      class="cursor-pointer"
      active={$page.url.pathname == "/create/*" ? true : false}
    >
      <Chevron aligned>Create</Chevron>
    </NavLi>

    {#if isLoggedIn}
      <NavLi
        id="my-library"
        class="cursor-pointer"
        active={$page.url.pathname == "/my-*" ? true : false}
      >
        <Chevron aligned>My Library</Chevron>
      </NavLi>
    {/if}

    <Dropdown triggeredBy="#library" class="w-44 z-20">
      <DropdownItem>
        <NavLi href="/sets">Set</NavLi>
      </DropdownItem>
      <DropdownItem>
        <NavLi href="/folders">Folders</NavLi>
      </DropdownItem>
    </Dropdown>

    <Dropdown triggeredBy="#create" class="w-44 z-20">
      <DropdownItem>
        <NavLi href="/create/sets">Set</NavLi>
      </DropdownItem>
      <DropdownItem>
        <NavLi href="/create/folder">Folders</NavLi>
      </DropdownItem>
      <DropdownItem>
        <NavLi href="/create/url">Import</NavLi>
      </DropdownItem>
    </Dropdown>

    <Dropdown triggeredBy="#my-library" class="w-44 z-20">
      <DropdownItem>
        <NavLi href="/my-sets">Set</NavLi>
      </DropdownItem>
      <DropdownItem>
        <NavLi href="/my-folders">Folders</NavLi>
      </DropdownItem>
    </Dropdown>
  </NavUl>
</Navbar>

