import { COOKIE_KEY, COOKIE_KEY_EXP, COOKIE_KEY_USER } from '$lib/utils/constants';
import cookieDomain from '$lib/utils/cookieDomain';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, cookies, fetch }) => {
    cookies.delete(COOKIE_KEY, { domain: cookieDomain })
    cookies.delete(COOKIE_KEY_EXP, { domain: cookieDomain })
    cookies.delete(COOKIE_KEY_USER, { domain: cookieDomain })
    locals.user = null
    locals.token = null
    await fetch(`/cookies?key=${COOKIE_KEY},${COOKIE_KEY_USER},${COOKIE_KEY_EXP}`, { method: "delete" })
        .then(() => {
            return new Response(null, {
                status: 301,
                headers: {
                    Location: '/'
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
        status: 301,
        headers: {
            Location: '/'
        }
    });
};