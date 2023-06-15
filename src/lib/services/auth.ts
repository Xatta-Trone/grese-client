/** @format */

import { error, redirect } from "@sveltejs/kit";
import { writable } from "svelte/store";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { PUBLIC_API_URL } from '$env/static/public';


export const token = writable<string | null>(null);
export const user = writable<UserInterface | null>(null);
export const hasAuthInitialized = writable<boolean>(false);

export async function login(name: string, email: string, token_data: string) {
  hasAuthInitialized.set(true);

  try {
    const res = await fetch(`${PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        token: token_data,
      }),
    });

    const data: LoginResponse = await res.json();

    console.log(data);

    setUser(data.token, data.user);
  } catch (e) {
    logout();
    throw error(401);
  }
}

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

export function setUser(t: string, u: UserInterface) {
  token.set(t);
  user.set(u);
  if (browser) {
    console.log("browser", browser);
    window.localStorage.setItem("token", t);
    window.localStorage.setItem("user", JSON.stringify(u));
  }
}

export interface LoginResponse {
  token: string;
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
