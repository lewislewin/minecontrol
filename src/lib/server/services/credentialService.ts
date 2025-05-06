// lib/server/services/credentialService.ts
import { awsCredentials } from '../schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid';

export type AwsCredInput = {
    accessKeyId: string
    secretAccessKey: string
    region: string
    name: string
}

export type AwsCredResult = {
    id: string
    accessKeyId: string
    region: string
    name: string
}

export async function addCredential(db: ReturnType<typeof import('../db').getDb>, userId: string, creds: AwsCredInput): Promise<AwsCredResult> {
    const { accessKeyId, secretAccessKey, region, name} = creds
    const id = uuidv4()
    await db.insert(awsCredentials).values({
        id, userId, accessKeyId, secretAccessKey, region, name
    })
    return { id, accessKeyId, region, name }
}

export async function listCredentials(db: ReturnType<typeof import('../db').getDb>, userId: string) {
    return await db.select().from(awsCredentials)
        .where(eq(awsCredentials.userId, userId))
        .all()
}
