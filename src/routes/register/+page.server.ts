// src/routes/register/+page.server.ts
import type { PageServerLoad, Actions } from './$types'
import { fail, redirect }               from '@sveltejs/kit'
import { createUser, findUserByEmail }  from '$lib/server/services/userService'
import { createSession }                from '$lib/server/services/sessionService'

export const load: PageServerLoad = () => ({})

export const actions: Actions = {
  default: async ({ request, locals, cookies }) => {
    const data     = await request.formData()
    const name     = (data.get('name') as string ?? '').trim()
    const email    = (data.get('email') as string ?? '').trim()
    const password = (data.get('password') as string ?? '')

    // basic validation
    if (!name || !email || !password) {
      return fail(400, { name, email, error: 'All fields are required' })
    }

    // prevent dupes
    if (await findUserByEmail(locals.db, email)) {
      return fail(400, { name, email, error: 'Email already registered' })
    }

    // create user + session
    const user = await createUser(locals.db, { name, email, password })
    const { id: sid, expires } = await createSession(locals.db, user.id)

    // set cookie (in dev you might remove `secure: true`)
    cookies.set('sid', sid, {
      path: '/', httpOnly: true, sameSite: 'lax',
      secure: false,                 // toggle to true in prod
      expires: new Date(expires * 1000)
    })

    throw redirect(303, '/')
  }
}
