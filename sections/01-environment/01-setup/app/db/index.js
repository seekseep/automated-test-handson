// データ層の入口。PostgreSQL 接続プールを開き、スキーマ/初期データを用意し、
// 接続を束ねた repo（usecase に渡す窓口）を提供する。
import pg from 'pg'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { readFileSync } from 'node:fs'

import * as items from './items/index.js'
import * as orders from './orders/index.js'
import * as orderDetails from './order-details/index.js'

const { Pool } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))

// 接続情報は DATABASE_URL（compose で渡す）か、無ければローカル既定値。
const connectionString =
  process.env.DATABASE_URL ?? 'postgres://app:app@localhost:5432/shop'

export const pool = new Pool({ connectionString })

/**
 * db/ 配下の SQL ファイルを文字列で読み込む。
 * @param {string} name ファイル名（例: 'schema.sql'）
 * @returns {string} SQL の中身
 */
function sql(name) {
  return readFileSync(join(__dirname, '..', '..', 'db', name), 'utf8')
}

/**
 * スキーマ作成＋初期データ投入（items が空のときだけ投入する）。
 * 起動直後は Postgres がまだ受け付けないことがあるので、接続を数回リトライする。
 * @returns {Promise<boolean>} 初期データを投入したら true、既にあれば false
 */
export async function setup() {
  await waitForDb()
  await pool.query(sql('schema.sql'))
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM items')
  if (rows[0].n > 0) return false
  await pool.query(sql('seed.sql'))
  return true
}

/** Postgres が応答するまで待つ（compose の起動順対策）。 */
async function waitForDb(retries = 30, intervalMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1')
      return
    } catch {
      await new Promise((r) => setTimeout(r, intervalMs))
    }
  }
  throw new Error('database not reachable')
}

/**
 * 接続を束ねた repo。メソッド名・引数は usecase が期待する形（id だけ渡す等）。
 * すべて Promise を返す（PostgreSQL は非同期）。
 * @type {import('../types.js').Repo}
 */
export const repo = {
  getItem(id) {
    return items.getItem(pool, id)
  },
  allItems() {
    return items.allItems(pool)
  },
  searchItems(keyword, category) {
    return items.searchItems(pool, keyword, category)
  },

  allOrders() {
    return orders.allOrders(pool)
  },
  getOrder(id) {
    return orders.getOrder(pool, id)
  },
  orderCount() {
    return orders.orderCount(pool)
  },
  createOrder(createdAt, total, lines) {
    return orders.createOrder(pool, createdAt, total, lines)
  },

  allOrderDetails() {
    return orderDetails.allOrderDetails(pool)
  },
  detailsOf(orderId) {
    return orderDetails.detailsOf(pool, orderId)
  },
}
