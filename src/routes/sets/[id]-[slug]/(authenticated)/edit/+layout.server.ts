import type { LayoutServerLoad } from './$types';

export const load = (async ({ parent, locals }) => {
    await parent();
    return {
        user: locals.user
    };
}) satisfies LayoutServerLoad;