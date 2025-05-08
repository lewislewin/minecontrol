// lib/server/services/userService.ts
import bcrypt from 'bcryptjs'
import { users } from '../schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid';

export async function createUser(db: ReturnType<typeof import('../db').getDb>, { name, email, password }: { name: string, email: string, password: string }) {
    const hash = await bcrypt.hash(password, 10)
    const id = uuidv4()
    await db.insert(users).values({ id, name, email, password: hash })
    return { id, name, email }
}

export async function updateUser(
    db: ReturnType<typeof import('../db').getDb>,
    userId: string,
    updates: { name?: string; email?: string; password?: string }
  ) {
    const payload: Record<string, string> = {}
  
    if (updates.name?.trim())  payload.name  = updates.name.trim()
    if (updates.email?.trim()) payload.email = updates.email.trim()
  
    if (updates.password && updates.password.length) {
      // bcryptjs hashSync is fast enough for a single user op
      payload.password = bcrypt.hashSync(updates.password, 10)
    }
  
    if (Object.keys(payload).length)
      await db.update(users).set(payload).where(eq(users.id, userId)).run()
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