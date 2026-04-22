const { Pool } = require('pg')

// This script safely truncates common application tables used for demo/mock data.
// It checks for table existence before truncating and restarts identity.
// Usage: set env DATABASE_URL or ensure backend .env is loaded, then run:
//   node scripts/clear_mock_data.js

const connectionString = process.env.DATABASE_URL || process.env.PG_CONNECTION || ''

if (!connectionString) {
  console.error('DATABASE_URL not set. Set DATABASE_URL environment variable and retry.')
  process.exit(1)
}

const pool = new Pool({ connectionString })

const tables = [
  'pos_transactions',
  'transactions',
  'ai_services',
  'semen_straws',
  'products',
  'inventory_products',
  'farmers',
  'veterinary_consultations',
  'credits',
  'receipts'
]

async function clearTables() {
  const client = await pool.connect()
  try {
    console.log('Starting safe truncate of demo tables...')
    for (const table of tables) {
      const check = await client.query("SELECT to_regclass($1) AS exists", [`public.${table}`])
      if (check.rows[0].exists) {
        console.log(`Truncating ${table} ...`)
        await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`)
      } else {
        console.log(`Table ${table} not found — skipping`)
      }
    }
    console.log('Truncate completed.')
  } catch (err) {
    console.error('Error while truncating tables:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

clearTables().then(() => {
  console.log('Finished. To reseed sample users run: (in backend folder) npm run db:seed')
})
