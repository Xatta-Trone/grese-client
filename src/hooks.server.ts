import type { MeEndpointResponse, UserInterface } from '$lib/services/auth';
import axiosAPI from '$lib/services/customAxios';
import { COOKIE_KEY, COOKIE_KEY_USER } from '$lib/utils/constants';
import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {

    // get cookies 
    const token = event.cookies.get(COOKIE_KEY)
    const userValue = event.cookies.get(COOKIE_KEY_USER)

    console.log("hooks server")
    console.log(token)
    // console.log(userValue)
    if (userValue != undefined) {
        const user = JSON.parse(userValue) as UserInterface
        event.locals.user = user
    }

    if (token != undefined) {
        event.locals.token = token

        axiosAPI
            .get('/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => {
                const response: MeEndpointResponse = res.data
                console.log('hooks server me', response)
                event.locals.user = response.data
            });
    }







    const response = await resolve(event);

    return response;
}) satisfies Handle;

