// DB層テスト用ヘルパー。実際の PostgreSQL に繋ぎ、テストごとに専用スキーマを作って隔離する。
// PostgreSQL が起動していない場合は reachable() が false を返し、テストはスキップする。
import pg from 'pg'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { readFileSync } from 'node:fs'

const { Pool } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))

export const CONNECTION_STRING =
  process.env.DATABASE_URL ?? 'postgres://app:app@localhost:5432/shop'

const SCHEMA_SQL = readFileSync(join(__dirname, '..', '..', 'db', 'schema.sql'), 'utf8')

/** PostgreSQL に接続できるか（未起動ならテストをスキップする判断に使う）。 */
export async function reachable() {
  const pool = new Pool({ connectionString: CONNECTION_STRING })
  try {
    await pool.query('SELECT 1')
    return true
  } catch {
    return false
  } finally {
    await pool.end()
  }
}

/**
 * テスト専用スキーマを作り直し、その中にテーブルを用意した Pool を返す。
 * 返した Pool は search_path がそのスキーマに固定されている。
 * @param {string} schema スキーマ名（テストファイルごとに固有の固定値）
 * @returns {Promise<import('pg').Pool>} スキーマに隔離された接続プール
 */
export async function setupSchema(schema) {
  const admin = new Pool({ connectionString: CONNECTION_STRING })
  await admin.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`)
  await admin.query(`CREATE SCHEMA ${schema}`)
  await admin.end()

  const pool = new Pool({ connectionString: CONNECTION_STRING, options: `-c search_path=${schema}` })
  await pool.query(SCHEMA_SQL)
  return pool
}

/**
 * テスト用スキーマを破棄し、接続を閉じる。
 * @param {string} schema スキーマ名
 * @param {import('pg').Pool} pool setupSchema が返した Pool
 */
export async function teardownSchema(schema, pool) {
  await pool.end()
  const admin = new Pool({ connectionString: CONNECTION_STRING })
  await admin.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`)
  await admin.end()
}
