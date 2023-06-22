/** @format */

import { error, redirect } from "@sveltejs/kit";
import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { goto, invalidateAll } from "$app/navigation";
import { COOKIE_KEY, COOKIE_KEY_EXP, COOKIE_KEY_USER } from "$lib/utils/constants";
import { redirectHelper } from "$lib/utils/helpers";


export const token = writable<string | null>(null);
export const user = writable<UserInterface | null>(null);
export const hasAuthInitialized = writable<boolean>(false);


export async function logout() {
  if (browser) {
    const colorTheme = window.localStorage.getItem('color-theme')
    window.localStorage.clear();
    if (colorTheme != null) {
      localStorage.setItem('color-theme', colorTheme)
    }

    await fetch(`${window.location.origin}/cookies?key=${COOKIE_KEY},${COOKIE_KEY_USER},${COOKIE_KEY_EXP}`, { method: "delete" })
      .then(() => {
        // token.set(null);
        // user.set(null);
        window.location.href = "/"
      })
  }
  redirectHelper('/')

}

export function setUser(t: string, u: UserInterface, exp: Date) {

  token.set(t);
  user.set(u);

  setData(t, u, exp)
}

export function setData(t: string, u: UserInterface, exp: Date) {
  if (browser) {
    console.log("browser", browser);
    // window.localStorage.setItem(COOKIE_KEY, t);
    // window.localStorage.setItem(COOKIE_KEY_USER, JSON.stringify(u));
    // window.localStorage.setItem(COOKIE_KEY_EXP, JSON.stringify(exp));
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
  expires_on: Date | null;
}

export interface MeEndpointResponse {
  data: UserInterface;
}