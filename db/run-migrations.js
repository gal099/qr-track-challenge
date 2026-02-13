/**
 * Simple migration runner for Vercel Postgres
 * Run with: node db/run-migrations.js
 */

const { sql } = require('@vercel/postgres')
const fs = require('fs')
const path = require('path')

async function runMigrations() {
  try {
    console.log('Starting database migrations...')

    // Get all migration files
    const migrationsDir = path.join(__dirname, 'migrations')
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort()

    console.log(`Found ${files.length} migration files`)

    for (const file of files) {
      console.log(`\nApplying migration: ${file}`)
      const filePath = path.join(migrationsDir, file)
      const migrationSQL = fs.readFileSync(filePath, 'utf8')

      await sql.query(migrationSQL)
      console.log(`✓ ${file} applied successfully`)
    }

    console.log('\n✅ All migrations completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigrations()
