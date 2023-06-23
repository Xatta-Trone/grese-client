import { redirectHelper } from '$lib/utils/helpers';
import type { LayoutServerLoad } from '../$types';

export const load = (async ({ url, locals, parent }) => {
    await parent()
    if (locals.user == null || locals.user == undefined) {
        redirectHelper('/login', url)
    }

    return {};
}) satisfies LayoutServerLoad;