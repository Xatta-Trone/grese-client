import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = (async () => {
    const wellKnown = await fetch('https://accounts.google.com/.well-known/openid-configuration', {
        headers: { Accept: 'application/json' }
    });
    const wellKnownJson = await wellKnown.json();
    const authEndpoint = wellKnownJson.authorization_endpoint;

    const options = {
        access_type: 'online',
        scope: ['profile', 'email'],
        redirect_uri: env.AUTH_REDIRECT,
        response_type: 'code',
        client_id: env.GOOGLE_CLIENT_ID
    };

    const url = `${authEndpoint}/auth?access_type=${options.access_type}&scope=${encodeURIComponent(
        options.scope.join(' ')
    )}&redirect_uri=${encodeURIComponent(options.redirect_uri)}&response_type=${options.response_type
        }&client_id=${options.client_id}`;



    return new Response(null, {
        status: 302,
        headers: {
            location: url.toString()
        }
    });
});