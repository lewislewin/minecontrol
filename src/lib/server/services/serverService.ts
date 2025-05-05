// lib/server/services/serverService.ts
import { servers } from '../schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function addServer(db: ReturnType<typeof import('../db').getDb>, userId: string, credentialId: string, instanceId: string, rawPassword: string) {
    const token = randomUUID()
    await db.insert(servers).values({
        id: randomUUID(),
        userId,
        credentialId,
        instanceId,
        password: rawPassword,
        token,
    })
    return { token }
}

export async function getServerByToken(db: ReturnType<typeof import('../db').getDb>, token: string) {
    return await db.select()
        .from(servers)
        .where(eq(servers.token, token))
        .get()
}
