// src/lib/awsService.ts
import { EC2 } from '@aws-sdk/client-ec2'

export type AwsCredPlain = {
  accessKeyId: string
  secretAccessKey: string
  region: string
}

function ec2For(cred: AwsCredPlain) {
  return new EC2({
    region: cred.region,
    credentials: {
      accessKeyId:     cred.accessKeyId,
      secretAccessKey: cred.secretAccessKey
    }
  })
}

export async function getInstanceInfo(cred: AwsCredPlain, instanceId: string) {
  const ec2 = ec2For(cred)

  const [statusResp, descrResp] = await Promise.all([
    ec2.describeInstanceStatus({
      InstanceIds: [instanceId],
      IncludeAllInstances: true
    }),
    ec2.describeInstances({ InstanceIds: [instanceId] })
  ])

  const state    = statusResp.InstanceStatuses?.[0]?.InstanceState?.Name ?? 'unknown'
  const inst     = descrResp.Reservations?.[0]?.Instances?.[0]
  const publicIp = inst?.PublicIpAddress ?? 'unknown'

  return { state, publicIp }
}

export function startInstance(cred: AwsCredPlain, instanceId: string) {
  return ec2For(cred).startInstances({ InstanceIds: [instanceId] })
}

export function stopInstance(cred: AwsCredPlain, instanceId: string) {
  return ec2For(cred).stopInstances({ InstanceIds: [instanceId] })
}
