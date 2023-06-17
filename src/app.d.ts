// See https://kit.svelte.dev/docs/types#app

import type { UserInterface } from "$lib/services/auth";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			'user': UserInterface | null
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
