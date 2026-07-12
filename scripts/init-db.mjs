import { neon } from '@neondatabase/serverless'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

const sql = neon(url)

await sql`
  CREATE TABLE IF NOT EXISTS users (
    email            TEXT PRIMARY KEY,
    password_hash    TEXT NOT NULL,
    password_changed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`

await sql`
  CREATE TABLE IF NOT EXISTS progress (
    email        TEXT NOT NULL,
    lesson_key   TEXT NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (email, lesson_key)
  )
`

await sql`
  CREATE TABLE IF NOT EXISTS password_resets (
    token_hash  TEXT PRIMARY KEY,
    email       TEXT NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    used        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`

// Account access state: existing accounts stay 'active'; accounts created
// during a Cardcom purchase start as 'pending' until payment is confirmed.
await sql`
  ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active'
`

// One row per Cardcom payment page (Low Profile) generated.
await sql`
  CREATE TABLE IF NOT EXISTS purchases (
    low_profile_id TEXT PRIMARY KEY,
    email          TEXT NOT NULL,
    amount         NUMERIC NOT NULL,
    status         TEXT NOT NULL DEFAULT 'created',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at        TIMESTAMPTZ
  )
`

// Captured from the course-sales landing form and carried through checkout,
// so a paid purchase can be reported (name/phone) to the monday.com tracker.
await sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS name TEXT`
await sql`ALTER TABLE purchases ADD COLUMN IF NOT EXISTS phone TEXT`

const tables = await sql`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' ORDER BY table_name
`
console.log('Tables:', tables.map(t => t.table_name).join(', '))
console.log('Schema ready.')
