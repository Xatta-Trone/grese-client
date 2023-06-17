import { user, type UserInterface } from '$lib/services/auth';
import { getCookie } from 'typescript-cookie';
import type { LayoutLoad } from './$types';
import { COOKIE_KEY } from '$lib/utils/constants';

let u: UserInterface | null

user.subscribe(val => {
    u = val
})

export const load = (async ({ fetch }) => {
    console.log("layouts.ts")

    console.log(u)

    return {};
}) satisfies LayoutLoad;