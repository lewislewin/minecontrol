// src/routes/logout/+server.ts
import { deleteSession } from '$lib/server/services/sessionService'
import { redirect, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ locals, cookies }) => {
  const sid = cookies.get('sid')
  if (sid) await deleteSession(locals.db, sid)
  cookies.delete('sid', { path:'/' })
  throw redirect(302, '/login')
}
