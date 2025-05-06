import { verifyUser } from '$lib/server/services/userService'
import { createSession } from '$lib/server/services/sessionService'
import { redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from '../$types'

export const load: PageServerLoad = () => ({})   // nothing

export const actions: Actions = {
  default: async ({ request, locals, cookies }) => {
    const f = await request.formData()
    const email = f.get('email')?.toString() ?? ''
    const pwd   = f.get('password')?.toString() ?? ''

    const user = await verifyUser(locals.db, email, pwd)
    if (!user) return { success:false, error:'bad creds' }

    const { id: sid, expires } = await createSession(locals.db, user.id)
    cookies.set('sid', sid, {
      path:'/', httpOnly:true, sameSite:'lax',
      secure: true,           // ← remove if you don’t use https locally
      expires: new Date(expires*1000)
    })
    throw redirect(302, '/')
  }
}
