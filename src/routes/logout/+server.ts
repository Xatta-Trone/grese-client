import axiosAPI from '$lib/services/customAxios';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { COOKIE_KEY, COOKIE_KEY_EXP, COOKIE_KEY_USER } from '$lib/utils/constants';
import { token, user } from '$lib/services/auth';
import { redirectHelper } from '$lib/utils/helpers';
import { invalidateAll } from '$app/navigation';
import cookieDomain from '$lib/utils/cookieDomain';

export const GET: RequestHandler = async ({ locals, cookies, fetch }) => {
    cookies.delete(COOKIE_KEY, { domain: cookieDomain })
    cookies.delete(COOKIE_KEY_EXP, { domain: cookieDomain })
    cookies.delete(COOKIE_KEY_USER, { domain: cookieDomain })
    locals.user = null
    locals.token = null
    fetch(`/cookies?key=${COOKIE_KEY},${COOKIE_KEY_USER},${COOKIE_KEY_EXP}`, { method: "delete" })
        .then(() => {
            return new Response(null, {
                status: 200,
                headers: {
                    Location: '/login'
                }
            });

        })

    // axiosAPI.post("lg")
    //     .then(res => {
    //         console.log("from logout server")
    //         console.log(res.data)
    //         token.set(null)
    //         user.set(null)

    //         locals.user = null
    //     })
    //     .catch(err => {
    //         console.log("error in logout")
    //         console.log(err)
    //         throw error(400)
    //     })
    // return redirectHelper('/login')

    // invalidateAll();

    return new Response(null, {
        status: 200,
        headers: {
            Location: '/login'
        }
    });
};