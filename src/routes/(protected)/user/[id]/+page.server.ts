import { findUserById, updateUser } from "$lib/server/services/userService";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ locals }) => {
    const user = await findUserById(locals.db, locals.user.id)
    
    return {
        user
    }
}

export const actions: Actions = {
    update: async ({ request, locals }) => {
        const f = await request.formData()
        const name = f.get('name')?.toString().trim() ?? ''
        const email = f.get('email')?.toString().trim() ?? ''
        const password = f.get('password')?.toString().trim() ?? ''

        await updateUser(locals.db, locals.user.id, {
            name,
            email,
            password
        })

        return { success: true }
    }
}