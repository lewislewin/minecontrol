// lib/server/services/db.ts
import { error } from 'console'
import { drizzle } from 'drizzle-orm/d1'
export function getDb(env: App.Platform['env'] | undefined) {
    if (!env) {
        throw error(500, "Env is not defined")
    }
    return drizzle(env.DB)
}
