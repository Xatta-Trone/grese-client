import type { CookieMaker } from '$lib/interfaces/cookiesInterface';
import type { MeEndpointResponse } from '$lib/services/auth';
import axiosAPI from '$lib/services/customAxios';
import { COOKIE_KEY_EXP, COOKIE_KEY_USER } from '$lib/utils/constants';
import cookieDomain from '$lib/utils/cookieDomain';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, parent, cookies, fetch }) => {
    await parent();
    console.log("layouts.server.ts")
    // console.log(locals.user)
    console.log(locals.token)
    let isLoggedIn = true

    if (locals.token != null || locals.token != undefined) {
        axiosAPI.get('/me', {
            headers: {
                "Authorization": `Bearer ${locals.token}`
            }
        })
            .then(res => {
                const response: MeEndpointResponse = res.data
                console.log('layout user call', response)
                locals.user = response.data
                isLoggedIn = true;

                const exp = cookies.get(COOKIE_KEY_EXP)


                if (exp != undefined) {
                    console.log(JSON.parse(exp ?? ""))

                    const date = JSON.parse(exp)

                    const formData = new FormData();
                    const data: CookieMaker = {
                        key: COOKIE_KEY_USER,
                        value: JSON.stringify(response.data),
                        expires: date
                    }
                    const data2: CookieMaker = {
                        key: 'COOKIE_KEY_USER',
                        value: JSON.stringify(response.data),
                        maxAge: 100
                    }

                    formData.append('cookies', JSON.stringify([data, data2]));

                    fetch("/cookies", {
                        method: "POST",
                        body: formData,

                    })

                    cookies.set("cookie.key", "cookie.value", {
                        maxAge: 100,
                        path: "/",
                        domain: cookieDomain
                    });

                }


            })

    }

    return {
        user: locals.user,
        isLoggedIn: locals.isLoggedIn == true ?? isLoggedIn ?? false, 	// user.subscribing
    };
}) satisfies LayoutServerLoad;