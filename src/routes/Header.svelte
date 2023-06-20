<!-- @format -->
<script lang="ts">
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
    Dropdown,
    DropdownItem,
    Chevron,
    DropdownDivider,
  } from "flowbite-svelte";
  import { page } from "$app/stores";
  import { user, logout } from "$lib/services/auth";
  let isLoggedIn: boolean = false;

  user.subscribe((val) => {
    isLoggedIn = val != null;
  });
</script>

<Navbar let:hidden let:toggle color="form">
  <NavBrand href="/">
    <span
      class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
    >
      GRE SE {isLoggedIn}
    </span>
  </NavBrand>
  <NavHamburger on:click={toggle} />
  <NavUl {hidden}>
    <NavLi href="/" active={$page.url.pathname == "/" ? true : false}
      >Home</NavLi
    >
    <NavLi href="/about" active={$page.url.pathname == "/about" ? true : false}
      >About</NavLi
    >
    <NavLi href="/sets" active={$page.url.pathname == "/sets" ? true : false}
      >Sets</NavLi
    >
    <NavLi
      href="/folders"
      active={$page.url.pathname == "/folders" ? true : false}>Folders</NavLi
    >
    <NavLi
      href="/my-sets"
      active={$page.url.pathname == "/my-sets" ? true : false}>My sets</NavLi
    >
    <NavLi
      href="/my-folders"
      active={$page.url.pathname == "/my-folders" ? true : false}
      >My folders</NavLi
    >

    <NavLi id="nav-menu12" class="cursor-pointer"
      ><Chevron aligned>Create</Chevron></NavLi
    >
    <Dropdown triggeredBy="#nav-menu12" class="w-44 z-20">
      <DropdownItem
        ><NavLi
          href="/create/sets"
          active={$page.url.pathname == "/login" ? true : false}>Set</NavLi
        ></DropdownItem
      >
      <DropdownItem
        ><NavLi
          href="/create/folder"
          active={$page.url.pathname == "/login" ? true : false}>Folder</NavLi
        ></DropdownItem
      >
      <DropdownItem
        ><NavLi
          href="/create/url"
          active={$page.url.pathname == "/login" ? true : false}>Import</NavLi
        ></DropdownItem
      >
    </Dropdown>

    {#if isLoggedIn}
      <NavLi id="nav-menu1" class="cursor-pointer"
        ><Chevron aligned>Profile</Chevron></NavLi
      >
      <Dropdown triggeredBy="#nav-menu1" class="w-44 z-20">
        <DropdownItem
          ><NavLi
            href="/profile"
            active={$page.url.pathname == "/profile" ? true : false}
            >My Profile</NavLi
          ></DropdownItem
        >
        <DropdownDivider />
        <DropdownItem><NavLi href="#" on:click={() => logout()}>Logout</NavLi
          ></DropdownItem>
        <!-- <DropdownItem><NavLi href="logout">Logout</NavLi></DropdownItem> -->
      </Dropdown>
    {:else}
      <NavLi
        href="/login"
        active={$page.url.pathname == "/login" ? true : false}>Login</NavLi
      >
      <NavLi
        href="/profile"
        active={$page.url.pathname == "/profile" ? true : false}>Profile</NavLi
      >
    {/if}
  </NavUl>
</Navbar>

<style>
</style>
