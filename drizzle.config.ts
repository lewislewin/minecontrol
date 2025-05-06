import type { Config } from 'drizzle-kit'

const config: Config = {
    schema: ['./src/lib/server/schema.ts'],
    out: './drizzle',
    driver: 'durable-sqlite',
    dialect: 'sqlite'
}

export default config