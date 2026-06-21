import { test } from 'node:test'
import assert from 'node:assert/strict'
import { listOrders } from './index.js'

test('各注文に売上内訳（taxable/exempt）を付ける', async () => {
  const detailsByOrder = {
    1: [{ price: 100000, quantity: 1, tax_category: 'STANDARD', tax_rate: 0.1 }],
    2: [{ price: 190, quantity: 1, tax_category: 'EXEMPT', tax_rate: 0 }],
  }
  const repo = {
    allOrders: () => [
      { id: 1, total: 110000 },
      { id: 2, total: 190 },
    ],
    detailsOf: (id) => detailsByOrder[id],
  }
  const result = await listOrders(repo)
  assert.equal(result.length, 2)
  assert.deepEqual(result[0].sales, { taxable: 110000, exempt: 0 })
  assert.deepEqual(result[1].sales, { taxable: 0, exempt: 190 })
})
