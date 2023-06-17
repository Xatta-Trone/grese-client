import { writable } from "svelte/store";



export const flipped = writable<boolean>(false);
export const showNonGre = writable<boolean>(false);
export const autoSpeak = writable<boolean>(false);
