import type { HandleClientError } from '@sveltejs/kit';

export const handleError = (async ({ error, event }) => {
    return {
        message: 'Whoops!',
    };
}) satisfies HandleClientError;