// lib/server/services/userService.ts
import bcrypt from 'bcryptjs'
import { users } from '../schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function createUser(db: ReturnType<typeof import('../db').getDb>, { name, email, password }: { name: string, email: string, password: string }) {
    const hash = await bcrypt.hash(password, 10)
    const id = randomUUID()
    await db.insert(users).values({ id, name, email, password: hash })
    return { id, name, email }
}

export async function findUserByEmail(db: ReturnType<typeof import('../db').getDb>, email: string) {
    return await db.select().from(users).where(eq(users.email, email)).get()
}

export async function verifyUser(db: ReturnType<typeof import('../db').getDb>, email: string, password: string) {
    const user = await findUserByEmail(db, email)
    if (!user) return null
    const ok = await bcrypt.compare(password, user.password)
    return ok ? user : null
}

export async function findUserById(db: ReturnType<typeof import('../db').getDb>, id: string) {
    return await db.select().from(users).where(eq(users.id, id)).get()
}