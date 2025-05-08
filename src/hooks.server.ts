// hooks.server.ts
import { getDb } from '$lib/server/db'
import { getSession } from '$lib/server/services/sessionService'
import { findUserById } from '$lib/server/services/userService'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const db = getDb(event.platform?.env)
  event.locals.db = db

  const sid = event.cookies.get('sid')
  if (sid) {
    const sess = await getSession(db, sid)
    if (sess) {
      const user = await findUserById(db, sess.userId)
      if (user) event.locals.user = { id: user.id, name: user.name }
    }
  }

  return resolve(event)
}
