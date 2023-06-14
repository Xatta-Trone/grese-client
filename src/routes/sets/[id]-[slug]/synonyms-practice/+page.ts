import { user } from '$lib/services/auth';
import { redirectHelper } from '$lib/utils/helpers';
import type { PageLoad } from './$types';

export const load = (async () => {
    user.subscribe((value) => {
        console.log(value);
        if (value == null) {
            redirectHelper('/login')
        }
    });
    return {};
}) satisfies PageLoad;