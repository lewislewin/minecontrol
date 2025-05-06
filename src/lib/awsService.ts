import { env } from '$env/dynamic/private';
import { PRIVATE_AWS_ACCESS_KEY, PRIVATE_AWS_ACCESS_KEY_SECRET } from '$env/static/private';
import { EC2 } from '@aws-sdk/client-ec2';

const ec2 = new EC2({
    region: env.PRIVATE_AWS_REGION,
    credentials: {
        accessKeyId: PRIVATE_AWS_ACCESS_KEY,
        secretAccessKey: PRIVATE_AWS_ACCESS_KEY_SECRET
    }
})

export async function getInstanceInfo(instanceId: string) {
    const [statusResp, descrResp] = await Promise.all([
        ec2.describeInstanceStatus({
            InstanceIds: [instanceId],
            IncludeAllInstances: true
        }),
        ec2.describeInstances({
            InstanceIds: [instanceId]
        })
    ])

    const state = statusResp.InstanceStatuses?.[0]?.InstanceState?.Name ?? 'unknown'
    const inst = descrResp.Reservations?.[0]?.Instances?.[0]
    const publicIp = inst?.PublicIpAddress ?? 'unknown'

    return { state, publicIp }
}

export function startInstance(instanceId: string) {
    return ec2.startInstances({InstanceIds: [instanceId]})
}

export function stopInstance(instanceId: string) {
    return ec2.stopInstances({InstanceIds: [instanceId]})
}