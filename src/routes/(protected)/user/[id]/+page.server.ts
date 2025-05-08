import { findUserById } from "$lib/server/services/userService";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals }) => {
    const user = await findUserById(locals.db, locals.user.id)
    
    return {
        user
    }
}