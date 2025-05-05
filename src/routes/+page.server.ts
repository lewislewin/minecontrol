import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

import { EC2 } from '@aws-sdk/client-ec2';
import { error } from 'console';

export const load = (async () => {
    const instanceId: string | undefined = env.PRIVATE_AWS_INSTANCE_ID
    if (!instanceId) {
        throw error(500, 'AWS instance ID not configured')
    }
    const ec2 = new EC2({
        region: env.PRIVATE_AWS_REGION,

        credentials: {
            accessKeyId: env.PRIVATE_AWS_ACCESS_KEY,
            secretAccessKey: env.PRIVATE_AWS_ACCESS_KEY_SECRET
        }
    })

    const [statusResp, describeResp] = await Promise.all([
        ec2.describeInstanceStatus({
            InstanceIds: [instanceId],
            IncludeAllInstances: true,
        }),
        ec2.describeInstances({
            InstanceIds: [instanceId],
        })
    ])

    const currentStatus = statusResp.InstanceStatuses?.[0]?.InstanceState?.Name ?? 'unknown'
    const inst = describeResp.Reservations?.[0]?.Instances?.[0]
    const publicIp = inst?.PublicIpAddress ?? 'unknown'

    return { currentStatus, publicIp };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({request}) => {
        const instanceId: string | undefined = env.PRIVATE_AWS_INSTANCE_ID
        if (!instanceId) {
            throw error(500, 'AWS instance ID not configured')
        }
        const data = await request.formData()
        const password = data.get('password')

        if (password !== env.PRIVATE_SECRET_PASSWORD) {
            return { success: false, error: 'bad password'}
        }

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