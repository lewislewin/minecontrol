import type { Actions, PageServerLoad } from './$types'
import { listCredentials } from '$lib/server/services/credentialService'
import { addServer } from '$lib/server/services/serverService'
import { redirect } from '@sveltejs/kit'

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
    const name = f.get('name') as string
    const { id } = await addServer(
      locals.db,
      locals.user.id,
      credentialId,
      instanceId,
      password,
      name,
    )
    return redirect(301, '/servers/' + id)
  }
}
