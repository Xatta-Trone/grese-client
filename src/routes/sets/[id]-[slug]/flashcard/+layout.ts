import { user } from '$lib/services/auth';
import { redirectHelper } from '$lib/utils/helpers';
import type { LayoutLoad } from './$types';

export const load = (async ({url}) => {
    // console.log(url)

    user.subscribe((value) => {
        console.log(value);
        if (value == null) {
            redirectHelper('/login', url)
        }
    });
    return {};
}) satisfies LayoutLoad;