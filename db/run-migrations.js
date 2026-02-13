/**
 * Simple migration runner for Vercel Postgres
 * Run with: node db/run-migrations.js
 */

require('dotenv').config()
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

async function runMigrations() {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  })

  await client.connect()

  try {
    console.log('Starting database migrations...')

    // Ensure schema_migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `)

    // Get applied migrations
    const appliedResult = await client.query('SELECT version FROM schema_migrations ORDER BY version')
    const appliedVersions = new Set(appliedResult.rows.map(r => r.version))

    // Get all migration files
    const migrationsDir = path.join(__dirname, 'migrations')
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort()

    console.log(`Found ${files.length} migration files`)
    console.log(`Already applied: ${appliedVersions.size} migrations`)

    for (const file of files) {
      // Extract version from filename (e.g., "001_create_table.sql" -> 1)
      const versionMatch = file.match(/^(\d+)_/)
      if (!versionMatch) {
        console.log(`⚠️  Skipping ${file} - invalid filename format`)
        continue
      }

      const version = parseInt(versionMatch[1], 10)

      if (appliedVersions.has(version)) {
        console.log(`⏭️  Skipping ${file} - already applied`)
        continue
      }

      console.log(`\nApplying migration: ${file}`)
      const filePath = path.join(migrationsDir, file)
      let migrationSQL = fs.readFileSync(filePath, 'utf8')

      // Remove schema_migrations insert from the SQL (we'll handle it separately)
      migrationSQL = migrationSQL.replace(/INSERT INTO schema_migrations[\s\S]*?;/gi, '')

      await client.query(migrationSQL)

      // Track migration
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [version])

      console.log(`✓ ${file} applied successfully`)
    }

    console.log('\n✅ All migrations completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runMigrations()
