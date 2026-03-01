import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema.js'

export function createClient(db: D1Database) {
  return drizzle(db, { schema })
}

export type Database = ReturnType<typeof createClient>
export { schema }
