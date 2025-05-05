// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: ReturnType<typeof import('$lib/server/db').getDb>
			env: Platform['env']
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Platform {
			env: {
				DB: D1Database
			}
		}
	}
}

export {};
