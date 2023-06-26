import type { HandleClientError } from '@sveltejs/kit';

export const handleError = (async () => {
    return {
        message: 'Whoops!',
    };
}) satisfies HandleClientError;