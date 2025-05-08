// lib/server/services/credentialService.ts
import { awsCredentials, servers } from '../schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid';
import { env } from '$env/dynamic/private';

const text = new TextEncoder()

const toB64 = (ab: ArrayBuffer) =>
    (typeof Buffer !== 'undefined')
        ? Buffer.from(ab).toString('base64')
        : btoa(String.fromCharCode(... new Uint8Array(ab)))

const fromB64 = (str: string) =>
(typeof Buffer !== 'undefined'
    ? Uint8Array.from(Buffer.from(str, 'base64'))
    : Uint8Array.from(atob(str), c => c.charCodeAt(0)))

async function getKey() {
    const raw = fromB64(env.PRIVATE_ENCRYPTION_KEY)
    return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt'])
}

const ivLen = 12
function pack(iv: Uint8Array, ct: ArrayBuffer) {
    const out = new Uint8Array(iv.length + ct.byteLength)
    out.set(iv)
    out.set(new Uint8Array(ct), iv.length)
    return out.buffer
}
function unpack(buf: Uint8Array) {
    const iv = buf.slice(0, ivLen)
    const ct = buf.slice(ivLen)
    return { iv, ct }
}

export type AwsCredInput = {
    accessKeyId: string
    secretAccessKey: string
    region: string
    name: string
}

export type AwsCredResult = {
    id: string
    name: string
}

export type AwsCredDecrypted = {
    id: string
    accessKeyId: string
    secretAccessKey: string
    region: string
    name: string
}

export class CredentialInUseError extends Error {
    count: number
    ids: string[]
    constructor(count: number, ids: string[]) {
        super(`This credential is attached to ${count} server(s)`)
        this.name = 'CredentialInUseError'
        this.count = count
        this.ids = ids
    }
}

export async function addCredential(db: ReturnType<typeof import('../db').getDb>, userId: string, creds: AwsCredInput): Promise<AwsCredResult> {
    const { accessKeyId, secretAccessKey, region, name } = creds
    const key = await getKey()

    const iv = crypto.getRandomValues(new Uint8Array(ivLen))
    const encAccess = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, text.encode(accessKeyId))
    const encSecret = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, text.encode(secretAccessKey))

    const packedId = toB64(pack(iv, encAccess))
    const packedSec = toB64(pack(iv, encSecret))

    const id = uuidv4()

    await db.insert(awsCredentials).values({
        id,
        userId,
        accessKeyId: packedId,
        secretAccessKey: packedSec,
        region,
        name,
    })

    return { id, name }
}

export async function decryptBlob(blobB64: string) {
    const buf = fromB64(blobB64)
    const { iv, ct } = unpack(buf)
    const key = await getKey()
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct)
    return new TextDecoder().decode(plain)
}

export async function listCredentials(
    db: ReturnType<typeof import('../db').getDb>,
    userId: string
  ): Promise<AwsCredResult[]> {
    const rows = await db.select().from(awsCredentials)
      .where(eq(awsCredentials.userId, userId))
      .all()
  
    return rows.map(r => ({ id: r.id, name: r.name ?? '' }))
  }

export async function getCredential(
    db: ReturnType<typeof import('../db').getDb>,
    credentialId: string
): Promise<AwsCredDecrypted | null> {
    const row = await db.select().from(awsCredentials)
        .where(eq(awsCredentials.id, credentialId))
        .get()

    if (!row) return null

    const accessKeyId = await decryptBlob(row.accessKeyId)
    const secretAccessKey = await decryptBlob(row.secretAccessKey)

    return {
        id: row.id,
        accessKeyId,
        secretAccessKey,
        region: row.region,
        name: row.name ?? ''
    }
}

export async function deleteCredential(
    db: ReturnType<typeof import('../db').getDb>,
    credentialId: string
): Promise<void> {
    const srvs = await db.select().from(servers).where(eq(servers.credentialId, credentialId)).all()
    if (srvs.length > 0) throw new CredentialInUseError(srvs.length, srvs.map(s => (s.id)))
    await db.delete(awsCredentials).where(eq(awsCredentials.id, credentialId)).run()
}