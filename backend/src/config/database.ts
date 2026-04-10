import { Pool } from 'pg'
// PoolClient type imported separately for TypeScript only
import type { PoolClient } from 'pg'

// Support both DATABASE_URL and individual env variables
let poolConfig: any

if (process.env.DATABASE_URL) {
  // Railway PostgreSQL plugin provides DATABASE_URL
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  }
} else {
  // Local development configuration
  poolConfig = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Mw@ng!001.',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'sk_agrovet',
  }
}

const pool = new Pool(poolConfig)

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export async function query(text: string, params?: unknown[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Database query error', { text, error })
    throw error
  }
}

export async function getClient(): Promise<PoolClient> {
  const client = await pool.connect()
  return client
}

export default pool
