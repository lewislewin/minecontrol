import { getDb } from "$lib/server/db"
import type { Handle } from "@sveltejs/kit"

export const handle: Handle = async ({event, resolve}) => {
    event.locals.db = getDb(event.platform?.env)

    return await resolve(event)
}