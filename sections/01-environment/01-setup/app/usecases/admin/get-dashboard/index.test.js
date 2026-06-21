import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getDashboard } from './index.js'

test('全明細から課税/非課税売上と注文数を返す', async () => {
  const repo = {
    allOrderDetails: () => [
      { price: 100000, quantity: 1, tax_category: 'STANDARD', tax_rate: 0.1 }, // 110000 課税
      { price: 190, quantity: 2, tax_category: 'EXEMPT', tax_rate: 0 }, // 380 非課税
    ],
    orderCount: () => 3,
  }
  const result = await getDashboard(repo)
  assert.deepEqual(result.sales, { taxable: 110000, exempt: 380 })
  assert.equal(result.orderCount, 3)
})

test('税率0%でも標準課税は課税売上に入る', async () => {
  const repo = {
    allOrderDetails: () => [{ price: 1000, quantity: 1, tax_category: 'STANDARD', tax_rate: 0 }],
    orderCount: () => 1,
  }
  const result = await getDashboard(repo)
  assert.equal(result.sales.taxable, 1000)
  assert.equal(result.sales.exempt, 0)
})
