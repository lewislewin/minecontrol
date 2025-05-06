import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
    if (!locals.user && !url.pathname.startsWith('/login')) {
        throw redirect(302, '/login')
    }
    return { user: locals.user };
}) satisfies LayoutServerLoad;