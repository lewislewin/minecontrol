
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
});

export const awsCredentials = sqliteTable('aws_credentials', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    accessKeyId: text('access_key_id').notNull(),
    secretAccessKey: text('secret_access_key').notNull(),
    region: text('region').notNull(),
})

export const servers = sqliteTable('servers', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id),
    credentialId: text('credential_id')
        .notNull()
        .references(() => awsCredentials.id),
    instanceId: text('instance_id').notNull(),
    password: text('password').notNull(),
    token: text('token').notNull().unique(),
})
