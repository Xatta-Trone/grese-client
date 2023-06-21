import { redirectHelper } from '$lib/utils/helpers';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, parent }) => {
    await parent();
    if (locals.user != null || locals.user != undefined) {
        return redirectHelper("/profile?access=restricted")
    }
    return {};
}) satisfies PageServerLoad;