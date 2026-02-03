import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env
if (!DB_HOST || !DB_USER || !DB_PASS || !DB_NAME) {
  throw new Error('Missing database credentials in .env')
}

// Remove protocol if present in DB_HOST (user might have added https://)
const host = DB_HOST.replace(/^https?:\/\//, '')
const url = `mysql://${DB_USER}:${DB_PASS}@${host}:${DB_PORT}/${DB_NAME}`

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: { url },
  verbose: true,
  strict: true
})
