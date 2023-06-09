import { env } from "$env/dynamic/private";
import type { LoginResponse } from '$lib/services/auth';
import axiosAPI from '$lib/services/customAxios';
import { COOKIE_KEY, COOKIE_KEY_USER } from '$lib/utils/constants';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';


export const GET: RequestHandler = async ({ url, cookies, locals }) => {


    try {
        const code = url.searchParams.get("code");
        const wellKnown = await fetch(
            "https://accounts.google.com/.well-known/openid-configuration",
            {
                headers: { Accept: "application/json" },
            }
        );
        const wellKnownJson = await wellKnown.json();

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
        // console.log(idTokenData);

        const userInfo = await fetch(
            `${wellKnownJson.userinfo_endpoint}?access_token=${idTokenData.access_token}`,
            {
                method: "GET",
                headers: { Accept: "application/json" },
            }
        );

        const userInfoData = await userInfo.json();

        // console.log(userInfoData);

        if (userInfoData.error) {
            throw error(400, "Unauthenticated from user info data");
        }

        // now login to grese
        const res = await axiosAPI.post('/login', {
            name: userInfoData.name,
            email: userInfoData.email,
            token: idTokenData.access_token,
        })

        const data: LoginResponse = res.data;

        // setUser(data.token, data.user, data.exp);



        locals.user = data.user

        // console.log(data)

        const exp: Date = new Date(data.exp)

        console.log(exp)

        const domain = url.host.includes('gre-sentence-equivalence.com') ? '.gre-sentence-equivalence.com' : 'localhost'

        cookies.set(COOKIE_KEY, data.token, { expires: exp, path: '/', domain })
        cookies.set(COOKIE_KEY_USER, JSON.stringify(data.user), { expires: exp, path: '/', domain })
        // cookies.set(COOKIE_KEY_EXP, JSON.stringify(exp), { expires: exp, })

        // setHeaders({
        //     'set-cookie': cookies.serialize(COOKIE_KEY, data.token, { expires: exp, path: "/" })
        // })



        return new Response(null, {
            status: 307,
            headers: {
                location: '/'
            }
        });


    } catch (e) {
        console.log(e);
        throw error(400, "Unauthenticated from error");
    }

    return new Response(null, {
        status: 303,
        headers: {
            location: '/'
        }
    });
};