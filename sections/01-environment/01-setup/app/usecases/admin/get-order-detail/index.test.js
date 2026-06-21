import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getOrderDetail } from './index.js'

test('注文＋明細（税込小計）＋売上内訳を返す', async () => {
  const repo = {
    getOrder: (id) =>
      id === 1 ? { id: 1, created_at: '2026-06-21 12:00:00', total: 110380 } : undefined,
    detailsOf: () => [
      { name: 'ノートPC', price: 100000, quantity: 1, tax_category: 'STANDARD', tax_rate: 0.1 },
      { name: '切符', price: 190, quantity: 2, tax_category: 'EXEMPT', tax_rate: 0 },
    ],
  }
  const result = await getOrderDetail(repo, 1)
  assert.equal(result.order.id, 1)
  assert.equal(result.details[0].lineTotal, 110000)
  assert.equal(result.details[1].lineTotal, 380)
  assert.deepEqual(result.sales, { taxable: 110000, exempt: 380 })
})

test('注文が無ければ null', async () => {
  const repo = { getOrder: () => undefined }
  assert.equal(await getOrderDetail(repo, 999), null)
})
