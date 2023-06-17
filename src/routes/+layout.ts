import { user, type UserInterface } from '$lib/services/auth';
import type { LayoutLoad } from './$types';

let u: UserInterface | null

user.subscribe(val => {
    u = val
})

export const load = (async ({ fetch }) => {
    console.log("layouts.ts")

    console.log(u)

    return {};
}) satisfies LayoutLoad;