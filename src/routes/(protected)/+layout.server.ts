import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
    if (!url.pathname.includes('servers') && (!locals.user && !url.pathname.startsWith('/login'))) {
        throw redirect(302, '/login')
    }
    return { user: locals.user };
}) satisfies LayoutServerLoad;