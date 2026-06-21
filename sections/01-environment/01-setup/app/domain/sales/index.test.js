import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sumSalesByTaxability } from './index.js'
import { TAX_CATEGORY } from '../tax/index.js'

test('課税と非課税を tax_category で振り分ける', () => {
  const details = [
    { price: 100000, quantity: 1, tax_category: TAX_CATEGORY.STANDARD, tax_rate: 0.1 }, // 110000 課税
    { price: 200, quantity: 2, tax_category: TAX_CATEGORY.REDUCED, tax_rate: 0.08 }, // 216*2=432 課税
    { price: 5000, quantity: 1, tax_category: TAX_CATEGORY.EXEMPT, tax_rate: 0 }, // 5000 非課税
  ]
  const sales = sumSalesByTaxability(details)
  assert.deepEqual(sales, { taxable: 110432, exempt: 5000 })
})

test('税率0%でも標準課税は課税売上に集計される', () => {
  // ここが肝。税額0でも区分が STANDARD なら課税売上。
  const details = [{ price: 100000, quantity: 1, tax_category: TAX_CATEGORY.STANDARD, tax_rate: 0 }]
  const sales = sumSalesByTaxability(details)
  assert.equal(sales.taxable, 100000)
  assert.equal(sales.exempt, 0)
})

test('明細が空なら売上は0', () => {
  assert.deepEqual(sumSalesByTaxability([]), { taxable: 0, exempt: 0 })
})
