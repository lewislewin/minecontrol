import type { Actions, PageServerLoad } from './$types'
import { listCredentials } from '$lib/server/services/credentialService'
import { addServer } from '$lib/server/services/serverService'

export const load: PageServerLoad = async ({ locals }) => {
  const creds = await listCredentials(locals.db, locals.user.id)
  return { creds }
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const f = await request.formData()
    const instanceId = f.get('instanceId') as string
    const credentialId = f.get('credentialId') as string
    const password = f.get('password') as string
    const { token } = await addServer(
      locals.db,
      locals.user.id,
      credentialId,
      instanceId,
      password
    )
    return { success:true, token }
  }
}
