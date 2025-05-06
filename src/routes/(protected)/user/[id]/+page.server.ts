import { findUserById } from "$lib/server/services/userService";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ locals, params }) => {

    return {
        user: await findUserById(locals.db, params.id)
    }
}