import type { PageServerLoad } from './$types'
import { listCredentials } from '$lib/server/services/credentialService'

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user.id
  const creds  = await listCredentials(locals.db, userId)
  return { creds }
}
