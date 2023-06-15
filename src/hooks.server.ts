import type { Handle } from "@sveltejs/kit";

console.log('hooks called')

export const handle = (async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/custom')) {
        return new Response('custom response');
    }

    // event.locals.user = 'test'

    console.log(event.cookies.get('grese_token'), event.locals.user)

    const response = await resolve(event);
    return response;
}) satisfies Handle;