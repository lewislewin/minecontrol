// src/routes/servers/[id]/+page.server.ts
import type { PageServerLoad, Actions } from './$types'
import { error, redirect, fail } from '@sveltejs/kit'
import { getServerById } from '$lib/server/services/serverService'
import { getCredential } from '$lib/server/services/credentialService'
import {
  getInstanceInfo,
  startInstance,
  stopInstance
} from '$lib/awsService'

export const load: PageServerLoad = async ({ params, locals, url }) => {
  const srv = await getServerById(locals.db, params.id)
  if (!srv) throw error(404, 'Server not found')

  const cred = await getCredential(locals.db, srv.credentialId)
  if (!cred) throw error(500, 'Linked credential not found')

  try {
    const info = await getInstanceInfo(cred, srv.instanceId)
    return { srv, info }
  } catch {
    const reason = `${srv.name} has an invalid instance ID or cannot be found, redirecting to edit.`
    throw redirect(303, `/servers/${srv.id}/edit?error=${encodeURIComponent(reason)}`)
  }
}

export const actions: Actions = {
  start: async ({ params, locals, request }) => {
    const srv = await getServerById(locals.db, params.id)
    if (!srv) throw error(404, 'Server not found')

    const cred = await getCredential(locals.db, srv.credentialId)
    if (!cred) throw error(500, 'Linked credential missing')

    const form     = await request.formData()
    const password = form.get('password') as string

    if (!locals.user && password !== srv.password)
      return fail(401, { error: 'Unauthorized.' })

    await startInstance(cred, srv.instanceId)
    return { success: true }
  },

  stop: async ({ params, locals }) => {
    const srv = await getServerById(locals.db, params.id)
    if (!srv) throw error(404, 'Server not found')

    const cred = await getCredential(locals.db, srv.credentialId)
    if (!cred) throw error(500, 'Linked credential missing')

    await stopInstance(cred, srv.instanceId)
    return { success: true }
  },

  restart: async ({ params, locals }) => {
    const srv = await getServerById(locals.db, params.id)
    if (!srv) throw error(404, 'Server not found')

    const cred = await getCredential(locals.db, srv.credentialId)
    if (!cred) throw error(500, 'Linked credential missing')

    await stopInstance(cred, srv.instanceId)
    await startInstance(cred, srv.instanceId)
    return { success: true }
  }
}
