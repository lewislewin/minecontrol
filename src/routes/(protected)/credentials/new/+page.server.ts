import type { Actions, PageServerLoad } from './$types'
import { addCredential } from '$lib/server/services/credentialService'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async () => {
  return {}
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const f                = await request.formData()
    const accessKeyId      = String(f.get('accessKeyId'))
    const secretAccessKey  = String(f.get('secretAccessKey'))
    const region           = String(f.get('region'))
    const name             = String(f.get('name'))
    const userId           = locals.user.id

    try {
      await addCredential(
        locals.db,
        userId,
        { accessKeyId, secretAccessKey, region, name }
      )
    } catch (err) {
      return { success: false, error: "Failed to save credential"}
    }

    throw redirect(303, '/credentials')
  }
}
