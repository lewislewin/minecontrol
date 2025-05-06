// src/routes/servers/[id]/+page.server.ts
import type { PageServerLoad, Actions } from './$types'
import { error, redirect }          from '@sveltejs/kit'
import { getServerById, updateServer, deleteServer } from '$lib/server/services/serverService'
import { listCredentials }          from '$lib/server/services/credentialService'

export const load: PageServerLoad = async ({ params, locals, url }) => {
  const srv   = await getServerById(locals.db, params.id)
  if (!srv) throw error(404, 'Server not found')
  
  const creds = await listCredentials(locals.db, locals.user.id)
  const error = url.searchParams.get('error')

  return { srv, creds, error }
}

export const actions: Actions = {
  update: async ({ request, params, locals }) => {
    const f  = await request.formData()
    const srv = await getServerById(locals.db, params.id)
    if (!srv) throw error(404, 'Server not found')

    const nameVal       = (f.get('name')?.toString().trim()     ?? '')
    const instanceVal   = (f.get('instanceId')?.toString().trim() ?? '')
    const credVal       = f.get('credentialId')?.toString()
    const passVal       = (f.get('password')?.toString().trim() ?? '')

    const updated = {
      name:         nameVal     || srv.name,
      instanceId:   instanceVal || srv.instanceId,
      credentialId: credVal     || srv.credentialId,
      password:     passVal     || srv.password
    }

    await updateServer(locals.db, params.id, updated)

    throw redirect(303, `/servers/${params.id}`)
  },

  delete: async ({ params, locals }) => {
    await deleteServer(locals.db, params.id)
    throw redirect(303, '/')
  }
}
