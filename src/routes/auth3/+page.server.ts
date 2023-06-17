/** @format */

import type { PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import { setUser, type LoginResponse } from "$lib/services/auth";
import { error } from "@sveltejs/kit";
import { browser } from "$app/environment";
import axiosAPI from "$lib/services/customAxios";
import { COOKIE_KEY, COOKIE_KEY_EXP } from "$lib/utils/constants";

export const load = (async ({ url, cookies }) => {
  try {
    const code = url.searchParams.get("code");
    const wellKnown = await fetch(
      "https://accounts.google.com/.well-known/openid-configuration",
      {
        headers: { Accept: "application/json" },
      }
    );
    const wellKnownJson = await wellKnown.json();

    // console.log(wellKnownJson)

    const idToken = await fetch(wellKnownJson.token_endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: JSON.stringify({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.AUTH_REDIRECT,
        grant_type: "authorization_code",
      }),
    });

    const idTokenData = await idToken.json();
    console.log(idTokenData);

    const userInfo = await fetch(
      `${wellKnownJson.userinfo_endpoint}?access_token=${idTokenData.access_token}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    );

    const userInfoData = await userInfo.json();

    console.log(userInfoData);

    if (userInfoData.error) {
      throw error(400, "Unauthenticated from userinfodata");
    }

    // now login to grese
    const res = await axiosAPI.post('/login', {
      name: userInfoData.name,
      email: userInfoData.email,
      token: idTokenData.access_token,
    })
    // const res = await fetch("https://dev.gre-sentence-equivalence.com/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     name: userInfoData.name,
    //     email: userInfoData.email,
    //     token: idTokenData.access_token,
    //   }),
    // });

    // const data: LoginResponse = await res.json();
    console.log(res.headers)
    const data: LoginResponse = await res.data;

    console.log(data, browser);

    setUser(data.token, data.user);

    console.log(data)

    const exp: Date = new Date(data.exp)

    cookies.set(COOKIE_KEY, data.token, { expires: exp })
    cookies.set(COOKIE_KEY_EXP, JSON.stringify(data.exp), { expires: exp })


    return {
      success: true,
      data: data
    };
  } catch (e) {
    console.log(e);
    throw error(400, "Unauthenticated from error");
  }
}) satisfies PageServerLoad;
