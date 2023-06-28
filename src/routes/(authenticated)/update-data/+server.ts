import type { CookieMaker } from '$lib/interfaces/cookiesInterface';
import type { MeEndpointResponse } from '$lib/services/auth';
import axiosAPI from '$lib/services/customAxios';
import { COOKIE_KEY, COOKIE_KEY_EXP } from '$lib/utils/constants';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, cookies }) => {
    axiosAPI.get("/me").then((res) => {
        const response: MeEndpointResponse = res.data;
        locals.user = response.data
        // cookies 
        const exp = cookies.get(COOKIE_KEY_EXP)
        const formData = new FormData();
        const data: CookieMaker = {
            key: COOKIE_KEY,
            value: JSON.stringify(response.data),
            expires: exp
        }

        formData.append('cookies', JSON.stringify([data]));

        fetch("/cookies", {
            method: "POST",
            body: formData,

        })
    });
    return new Response();
};