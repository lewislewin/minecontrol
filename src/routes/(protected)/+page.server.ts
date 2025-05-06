import type { PageServerLoad } from './$types'
import { listServers } from '$lib/server/services/serverService'

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user.id
  const servers = listServers(locals.db, userId)
  return { servers }
}
