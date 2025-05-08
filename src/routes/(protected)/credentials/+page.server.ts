import type { PageServerLoad } from './$types'
import { CredentialInUseError, deleteCredential, listCredentials } from '$lib/server/services/credentialService'
import type { Actions } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals }) => {
  const userId = locals.user.id
  const creds  = await listCredentials(locals.db, userId)
  return { creds }
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const f = await request.formData()
    const id = f.get('id') as string
    if (!id) return { success: false, error: "Requires ID" }
    try {
      await deleteCredential(locals.db, id)
    } catch (e) {
      if (e instanceof CredentialInUseError) {
        return { message: e.message, ids: e.ids }
      }
    }
  }
}