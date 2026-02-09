import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'
import { env } from '$env/dynamic/private'

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = env

if (!DB_HOST || !DB_USER || !DB_PASS || !DB_NAME) {
  throw new Error('Missing database credentials')
}

// Remove protocol if present
const host = DB_HOST.replace(/^https?:\/\//, '')

const client = await mysql.createPool({
  host,
  port: parseInt(DB_PORT || '3306'),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

export const db = drizzle(client, { schema, mode: 'default' })
