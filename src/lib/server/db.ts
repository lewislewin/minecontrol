// lib/server/services/db.ts
import { drizzle } from 'drizzle-orm/d1'
export function getDb(env: App.Platform['env'] | undefined) {
    if (!env) {
        throw new Error('ENV NOT DEFINED')
    }
    return drizzle(env.DB)
}
