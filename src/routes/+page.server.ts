import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

import { EC2 } from '@aws-sdk/client-ec2';

export const load = (async () => {
    const ec2 = new EC2({
        region: env.PRIVATE_AWS_REGION,

        credentials: {
            accessKeyId: env.PRIVATE_AWS_ACCESS_KEY,
            secretAccessKey: env.PRIVATE_AWS_ACCESS_KEY_SECRET
        }
    })

    const instanceId = 'i-037dd598360a632ae'

    const resp = await ec2.describeInstanceStatus({ InstanceIds: [instanceId], IncludeAllInstances: true })
    const instanceStatus = resp.InstanceStatuses?.[0]?.InstanceState
    const currentStatus = instanceStatus?.Name ?? 'unknown'
    
    return { currentStatus };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({request}) => {
        const data = await request.formData()
        const password = data.get('password')

        if (password !== env.PRIVATE_SECRET_PASSWORD) {
            return { success: false, error: 'bad password'}
        }

        const instanceId = 'i-037dd598360a632ae'

        const ec2 = new EC2({
            region: env.PRIVATE_AWS_REGION,

            credentials: {
                accessKeyId: env.PRIVATE_AWS_ACCESS_KEY,
                secretAccessKey: env.PRIVATE_AWS_ACCESS_KEY_SECRET
            }
        })

        try {
            let ids: string[] = []
            ids = [instanceId]

            await ec2.startInstances({InstanceIds: ids})

            return { success: true, started: ids }
        } catch (err) {
            return { success: false, error: (err as Error).message }
        }
    }
} satisfies Actions