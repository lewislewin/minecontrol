import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

import { getInstanceInfo, startInstance } from '$lib/awsService';

export const load = (async () => {
    const id = env.PRIVATE_AWS_INSTANCE_ID
    if (!id) throw error(500, 'Missing AWS_INSTANCE_ID')
    const { state: currentStatus, publicIp } = await getInstanceInfo(id)

    return { currentStatus, publicIp };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ request }) => {
        const id = env.PRIVATE_AWS_INSTANCE_ID
        if (!id) throw error(500, 'AWS_INSTANCE_ID not set')
        const form = await request.formData()
        if (form.get('password') !== env.PRIVATE_SECRET_PASSWORD) {
            return { success: false, error: 'bad password' }
        }
        try {
            await startInstance(id)
            return { success: true, started: [id] }
        } catch (err) {
            return { success: false, error: (err as Error).message }
        }
    }
} satisfies Actions