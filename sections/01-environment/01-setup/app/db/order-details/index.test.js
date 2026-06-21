import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { reachable, setupSchema, teardownSchema } from '../test-helper.js'
import { allOrderDetails, detailsOf } from './index.js'

const SCHEMA = 'test_order_details'

if (!(await reachable())) {
  test('order_details db（PostgreSQL 未起動のためスキップ）', { skip: 'docker compose up db で PostgreSQL を起動してください' }, () => {})
} else {
  let pool

  before(async () => {
    pool = await setupSchema(SCHEMA)
    // 注文1: 明細2件 / 注文2: 明細1件
    await pool.query(`
      INSERT INTO orders (id, created_at, total) VALUES (1, '2026-06-21 12:00:00', 110380), (2, '2026-06-21 13:00:00', 200);
      INSERT INTO order_details (order_id, item_id, name, price, quantity, tax_category, tax_rate) VALUES
        (1, 2, 'ノートPC', 100000, 1, 'STANDARD', 0.1),
        (1, 6, '切符', 190, 2, 'EXEMPT', 0),
        (2, 1, '小麦粉', 200, 1, 'REDUCED', 0.08);
    `)
  })

  after(async () => {
    await teardownSchema(SCHEMA, pool)
  })

  test('detailsOf は注文IDの明細だけを id 昇順で返す', async () => {
    const details = await detailsOf(pool, 1)
    assert.equal(details.length, 2)
    assert.equal(details[0].name, 'ノートPC')
    assert.equal(details[1].name, '切符')
  })

  test('detailsOf: 別の注文の明細', async () => {
    const details = await detailsOf(pool, 2)
    assert.equal(details.length, 1)
    assert.equal(details[0].name, '小麦粉')
  })

  test('allOrderDetails は全明細', async () => {
    assert.equal((await allOrderDetails(pool)).length, 3)
  })
}
