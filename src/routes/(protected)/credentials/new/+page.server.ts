import type { Actions, PageServerLoad } from './$types'
import { addCredential } from '$lib/server/services/credentialService'

export const load: PageServerLoad = async () => {
  return {}
}

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const f                = await request.formData()
    const accessKeyId      = String(f.get('accessKeyId'))
    const secretAccessKey  = String(f.get('secretAccessKey'))
    const region           = String(f.get('region'))
    const userId           = locals.user.id

    const result = await addCredential(
      locals.db,
      userId,
      { accessKeyId, secretAccessKey, region }
    )

    return { success: true, cred: result }
  }
}
