// lib/server/services/serverService.ts
import { servers } from '../schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function addServer(db: ReturnType<typeof import('../db').getDb>, userId: string, credentialId: string, instanceId: string, rawPassword: string, name: string) {
    const id = randomUUID()
    await db.insert(servers).values({
        id,
        userId,
        credentialId,
        instanceId,
        password: rawPassword,
        name,
    })
    return { id }
}

export async function getServerById(db: ReturnType<typeof import('../db').getDb>, id: string) {
    return await db.select()
        .from(servers)
        .where(eq(servers.id, id))
        .get()
}

export async function listServers(db: ReturnType<typeof import('../db').getDb>, userId: string) {
    return await db.select().from(servers).where(eq(servers.userId, userId)).all()
}