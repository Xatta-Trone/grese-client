import axiosAPI from '$lib/services/customAxios';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { COOKIE_KEY, COOKIE_KEY_EXP } from '$lib/utils/constants';
import { token, user } from '$lib/services/auth';

export const GET: RequestHandler = async ({ locals, cookies }) => {


    axiosAPI.post("lg")
        .then(res => {
            console.log("from logout server")
            console.log(res.data)
            token.set(null)
            user.set(null)
            cookies.delete(COOKIE_KEY)
            cookies.delete(COOKIE_KEY_EXP)
            locals.user = null
        })
        .catch(err => {
            console.log("error in logout")
            console.log(err)
            throw error(400)
        })

    return new Response(null, {
        status: 200,
        headers: {
            location: '/'
        }
    });
};