import {
  mysqlTable,
  bigint,
  timestamp,
  varchar,
  text,
  int,
  boolean,
  mysqlEnum
} from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

// Base Model
const baseModel = {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  created_at: timestamp('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(),
  deleted_at: timestamp('deleted_at')
}

// Users Table
export const users = mysqlTable('users', {
  ...baseModel,
  email: varchar('email', { length: 255 }).unique(), // Nullable for some providers
  name: varchar('name', { length: 100 }),
  avatar_url: text('avatar_url')
})

// Accounts Table (Social Logins)
export const accounts = mysqlTable('accounts', {
  ...baseModel,
  user_id: bigint('user_id', { mode: 'number' })
    .notNull()
    .references(() => users.id),
  provider: varchar('provider', { length: 50 }).notNull(), // e.g., 'kakao', 'google'
  provider_account_id: varchar('provider_account_id', { length: 255 }).notNull(), // Social ID
  access_token: text('access_token'),
  refresh_token: text('refresh_token'),
  expires_at: timestamp('expires_at')
})

// Sessions Table
export const sessions = mysqlTable('sessions', {
  ...baseModel,
  user_id: bigint('user_id', { mode: 'number' })
    .notNull()
    .references(() => users.id),
  session_token: varchar('session_token', { length: 255 }).notNull().unique(),
  expires_at: timestamp('expires_at').notNull()
})

// Buildings Table
export const buildings = mysqlTable('buildings', {
  ...baseModel,
  user_id: bigint('user_id', { mode: 'number' })
    .notNull()
    .references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  price_per_clean: int('price_per_clean').default(0),
  scheduled_days: varchar('scheduled_days', { length: 255 }), // e.g. "Mon,Wed,Fri"
  memo: text('memo')
})

// Cleaning Logs Table
export const cleaningLogs = mysqlTable('cleaning_logs', {
  ...baseModel,
  building_id: bigint('building_id', { mode: 'number' })
    .notNull()
    .references(() => buildings.id),
  cleaned_date: timestamp('cleaned_date').notNull(),
  earned_amount: int('earned_amount').default(0),
  status: mysqlEnum('status', ['completed', 'skipped']).default('completed')
})
