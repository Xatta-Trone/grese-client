/** @format */

import type {
    CookieMaker,
    CookieResponse,
} from "$lib/interfaces/cookiesInterface";
import cookieDomain from "$lib/utils/cookieDomain";
import type { RequestHandler } from "./$types";


export const GET: RequestHandler = async ({ cookies, url }) => {
    const keys = url.searchParams.get("key");

    const res: CookieResponse[] = [];

    if (keys != null) {
        keys.split(",").forEach(key => {
            const singleCookie: CookieResponse = { key, value: null }
            const value = cookies.get(key);
            if (value != undefined) {
                singleCookie.value = value;
            }
            res.push(singleCookie)

        })
    }


    return new Response(JSON.stringify(res), {
        headers: {
            "content-type": "application/json",
        },
    });
};

export const POST: RequestHandler = async ({ cookies, request }) => {
    console.log("cookies post");
    const data = await request.formData();
    const cookieStringData = data.get("cookies");

    if (cookieStringData != undefined) {
        const cookieValues: CookieMaker[] = JSON.parse(cookieStringData.toString());

        cookieValues.forEach((cookie) => {
            console.log(cookie)
            cookies.set(cookie.key, cookie.value, {
                expires: cookie.expires,
                maxAge: cookie.maxAge,
                path: "/",
                domain: cookieDomain
            });
        });
    }

    return new Response("cookies set");
};

export const DELETE: RequestHandler = async ({ cookies, url }) => {
    const keys = url.searchParams.get("key");

    if (keys != null) {
        console.info("cookies delete");

        keys.split(",").forEach(key => {
            cookies.delete(key, { domain: cookieDomain });
        })



    }

    return new Response(JSON.stringify("cookie deleted"), {
        headers: {
            "content-type": "application/json",
        },
    });
};
