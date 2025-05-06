import type { Actions, PageServerLoad } from './$types'
import { getServerById } from '$lib/server/services/serverService'
import { getInstanceInfo, startInstance, stopInstance } from '$lib/awsService'
import { error, redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params, locals }) => {
  const srv = await getServerById(locals.db, params.id)
  if (!srv) throw error(500, "Server was not defined.")
  
  try {
    const info = await getInstanceInfo(srv.instanceId)
  } catch (error) {
    const reason = `${srv.name} has an invalid instance ID or cannot be found, redirecting to edit.`
    throw redirect(303, `/servers/${srv.id}/edit?error=${encodeURIComponent(reason)}`)
  }
  return { srv, info }
}

export const actions: Actions = {
  start: async ({ params, locals, request }) => {
    const srv = await getServerById(locals.db, params.id)
    if (!srv) throw error(500, "Server was not defined")
    
    const form = await request.formData()
    const password = form.get('password') as string

    if (!locals.user && password !== srv.password) {
      return { success: false, error: "Unauthorized."}
    }
      
    try {
      await startInstance(srv.instanceId)
    } catch (err) {
      throw error(500, err.message)
    }
  
    return { success: true }
  },

  stop: async ({ params, locals }) => {
    const srv = await getServerById(locals.db, params.id)
    if (!srv) throw error(500, "Server wasnt defined")

    await stopInstance(srv.instanceId)
    return { success: true }
  },

  restart: async ({ params, locals }) => {
    const srv = await getServerById(locals.db, params.id)
    if (!srv) throw error(500, "Server wasnt defined")

    await stopInstance(srv.instanceId)
    await startInstance(srv.instanceId)
    return { success: true }
  }
}
