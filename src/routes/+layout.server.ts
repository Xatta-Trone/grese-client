import type { LayoutServerLoad } from './$types';
import axiosAPI from '$lib/services/customAxios';
import type { MeEndpointResponse } from '$lib/services/auth';

export const load = (async ({ locals, parent }) => {
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
            });
    }

    return {
        user: locals.user,
        isLoggedIn: locals.isLoggedIn == true ?? isLoggedIn ?? false, 	// user.subscribing
    };
}) satisfies LayoutServerLoad;