import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import { login } from '$lib/services/auth';

export const load = (async ({ url }) => {

    try {
        const code = url.searchParams.get('code')
        const wellKnown = await fetch('https://accounts.google.com/.well-known/openid-configuration', {
            headers: { Accept: 'application/json' }
        });
        const wellKnownJson = await wellKnown.json();

        // console.log(wellKnownJson)

        const idToken = await fetch(wellKnownJson.token_endpoint, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: JSON.stringify({
                code,
                client_id: env.GOOGLE_CLIENT_ID,
                client_secret: env.GOOGLE_CLIENT_SECRET,
                redirect_uri: env.AUTH_REDIRECT,
                grant_type: 'authorization_code'
            })
        });

        const idTokenData = await idToken.json();

        console.log(idTokenData)

        const userInfo = await fetch(`${wellKnownJson.userinfo_endpoint}?access_token=${idTokenData.access_token}`, {
            method: 'GET',
            headers: { Accept: 'application/json' },
        });

        const userInfoData = await userInfo.json();

        console.log(userInfoData)

        if (userInfoData.error != undefined) {
            throw Error("Unauthenticated")
            // redirect(401, '/')

        }

        // now login to grese





        return {
            user: userInfoData,
            token: idTokenData.id_token
        };

    } catch (error) {
        throw Error("Unauthenticated")
    }


}) satisfies PageServerLoad;