import { browser } from '$app/environment';
import { user } from '$lib/services/auth';
import { INTENDED_KEY } from '$lib/utils/constants';
import { redirectHelper } from '$lib/utils/helpers';
import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
    console.log(url)

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
}) satisfies PageLoad;