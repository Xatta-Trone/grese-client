/** @format */

import { error, redirect } from "@sveltejs/kit";
import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { COOKIE_KEY, COOKIE_KEY_EXP, COOKIE_KEY_USER } from "$lib/utils/constants";


export const token = writable<string | null>(null);
export const user = writable<UserInterface | null>(null);
export const hasAuthInitialized = writable<boolean>(false);


export function logout() {
  if (browser) {
    window.localStorage.clear();
  }
  token.set(null);
  user.set(null);
  if (browser) {
    goto("/");
  } else {
    throw redirect(301, "/");
  }
}

export function setUser(t: string, u: UserInterface, exp: Date) {

  token.set(t);
  user.set(u);

  setData(t, u, exp)
}

export function setData(t: string, u: UserInterface, exp: Date) {
  if (browser) {
    console.log("browser", browser);
    window.localStorage.setItem(COOKIE_KEY, t);
    window.localStorage.setItem(COOKIE_KEY_USER, JSON.stringify(u));
    window.localStorage.setItem(COOKIE_KEY_EXP, JSON.stringify(exp));
  }
}

export interface LoginResponse {
  token: string;
  exp: Date;
  user: UserInterface;
}

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  username: string;
  created_at: Date;
  updated_at: Date;
}

export interface MeEndpointResponse {
  data: UserInterface;
}