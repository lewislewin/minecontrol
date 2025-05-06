// lib/server/services/sessionService.ts
import { sessions } from '../schema'
import { v4 as uuidv4 } from 'uuid';
import { add, getUnixTime } from 'date-fns'
import { gt, eq } from 'drizzle-orm'

export async function createSession(db, userId:string, maxAgeSec = 60*60*24*7) {
  const id = uuidv4()
  const expires = getUnixTime(add(new Date(), { seconds: maxAgeSec }))
  await db.insert(sessions).values({ id, userId, expires })
  return { id, expires }
}

export async function getSession(db, sid:string) {
  const now = getUnixTime(new Date())
  return await db.select().from(sessions)
    .where(eq(sessions.id, sid))
    .where(gt(sessions.expires, now))
    .get()
}

export async function deleteSession(db, sid:string) {
  await db.delete(sessions).where(eq(sessions.id, sid)).run()
}
