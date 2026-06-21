import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkout } from './index.js'

const items = {
  2: { id: 2, name: 'ノートPC', price: 100000, tax_category: 'STANDARD', tax_rate: 0.1 },
}

test('注文を作成して orderId と total を返す', async () => {
  const created = []
  const repo = {
    getItem: (id) => items[id],
    createOrder: (createdAt, total, lines) => {
      created.push({ createdAt, total, count: lines.length })
      return 42
    },
  }
  const result = await checkout(repo, {
    entries: [{ itemId: 2, quantity: 1 }],
    now: new Date('2026-06-21T12:34:56Z'),
  })
  assert.deepEqual(result, { orderId: 42, total: 110000 })
  assert.equal(created[0].total, 110000)
  assert.equal(created[0].createdAt, '2026-06-21 12:34:56')
  assert.equal(created[0].count, 1)
})

test('かごが空なら null（注文は作らない）', async () => {
  const repo = {
    getItem: () => undefined,
    createOrder: () => assert.fail('createOrder は呼ばれないはず'),
  }
  const result = await checkout(repo, { entries: [], now: new Date('2026-06-21T00:00:00Z') })
  assert.equal(result, null)
})
