import { user } from '$lib/services/auth';
import { redirectHelper } from '$lib/utils/helpers';
import type { LayoutServerLoad } from '../$types';

export const load = (async ({ url, locals, parent }) => {
    await parent()
    if (locals.user == null || locals.user == undefined) {
        redirectHelper('/login', url)
    }

    // user.subscribe((value) => {
    //     console.log(value);
    //     if (value == null) {

    //         // if (browser) {
    //         //     localStorage.setItem(INTENDED_KEY, url.pathname + url.search)
    //         // }

    //         redirectHelper('/login', url)
    //     }
    // });
    return {};
}) satisfies LayoutServerLoad;