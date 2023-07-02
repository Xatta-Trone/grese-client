import type { LayoutServerLoad } from './$types';

export const load = (async ({ parent, locals, url }) => {
    await parent();


    // if (locals.user?.expires_on == null) {
    //     console.log(url)
    //     const URIpath = url.pathname.split("/")
    //     URIpath.pop()
    //     const newURL = URIpath.join("/")
    //     console.log(newURL)

    //     throw redirect(301, `${newURL}?forbidden=true`)
    // }


    return {
        user: locals.user
    };
}) satisfies LayoutServerLoad;