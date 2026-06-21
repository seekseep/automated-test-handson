import { test, beforeEach, after } from 'node:test'
import assert from 'node:assert/strict'
import { reachable, setupSchema, teardownSchema } from '../test-helper.js'
import { allOrders, getOrder, orderCount, createOrder } from './index.js'

const SCHEMA = 'test_orders'

const lines = [
  {
    itemId: 2,
    name: 'ノートPC',
    unitPrice: 100000,
    quantity: 1,
    taxCategory: 'STANDARD',
    taxRate: 0.1,
  },
  { itemId: 6, name: '切符', unitPrice: 190, quantity: 2, taxCategory: 'EXEMPT', taxRate: 0 },
]

if (!(await reachable())) {
  test('orders db（PostgreSQL 未起動のためスキップ）', { skip: 'docker compose up db で PostgreSQL を起動してください' }, () => {})
} else {
  let pool

  // 各テストの前に空のテーブルへ作り直す（id 採番を 1 から確定させるため）。
  beforeEach(async () => {
    if (pool) await teardownSchema(SCHEMA, pool)
    pool = await setupSchema(SCHEMA)
  })

  after(async () => {
    await teardownSchema(SCHEMA, pool)
  })

  test('createOrder は注文を作り、採番された id を返す', async () => {
    const id = await createOrder(pool, '2026-06-21 12:00:00', 110380, lines)
    assert.equal(id, 1)
    assert.equal(await orderCount(pool), 1)
    assert.equal((await getOrder(pool, 1)).total, 110380)
  })

  test('createOrder は明細も保存する（コピー値で）', async () => {
    await createOrder(pool, '2026-06-21 12:00:00', 110380, lines)
    const { rows: details } = await pool.query('SELECT * FROM order_details ORDER BY id')
    assert.equal(details.length, 2)
    assert.equal(details[0].name, 'ノートPC')
    assert.equal(details[0].price, 100000)
    assert.equal(details[1].tax_category, 'EXEMPT')
    assert.equal(details[1].quantity, 2)
  })

  test('allOrders は id の降順', async () => {
    await createOrder(pool, '2026-06-21 10:00:00', 100, lines.slice(0, 1))
    await createOrder(pool, '2026-06-21 11:00:00', 200, lines.slice(0, 1))
    assert.deepEqual(
      (await allOrders(pool)).map((o) => o.id),
      [2, 1],
    )
  })

  test('注文が無ければ getOrder は undefined / orderCount は 0', async () => {
    assert.equal(await getOrder(pool, 1), undefined)
    assert.equal(await orderCount(pool), 0)
  })
}
