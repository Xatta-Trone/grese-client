import type { CookieMaker } from '$lib/interfaces/cookiesInterface';
import type { MeEndpointResponse } from '$lib/services/auth';
import axiosAPI from '$lib/services/customAxios';
import { COOKIE_KEY_EXP, COOKIE_KEY_USER } from '$lib/utils/constants';
import type { LayoutServerLoad } from './$types';
let isAlreadyRun = false

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


                if (exp != undefined && isAlreadyRun == false) {
                    isAlreadyRun = true
                    console.log(JSON.parse(exp ?? ""))

                    const date = JSON.parse(exp)

                    const formData = new FormData();
                    const data: CookieMaker = {
                        key: COOKIE_KEY_USER,
                        value: JSON.stringify(response.data),
                        expires: date
                    }


                    formData.append('cookies', JSON.stringify([data]));

                    fetch("/cookies", {
                        method: "POST",
                        body: formData,

                    })

                }


            })

    }

    return {
        user: locals.user,
        isLoggedIn: locals.isLoggedIn == true ?? isLoggedIn ?? false, 	// user.subscribing
    };
}) satisfies LayoutServerLoad;