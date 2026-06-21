import { test } from 'node:test'
import assert from 'node:assert/strict'
import { toCartLine, cartTotal } from './index.js'
import { TAX_CATEGORY } from '../tax/index.js'

const flour = {
  id: 1,
  name: '小麦粉',
  price: 200,
  tax_category: TAX_CATEGORY.REDUCED,
  tax_rate: 0.08,
}
const pc = {
  id: 2,
  name: 'ノートPC',
  price: 100000,
  tax_category: TAX_CATEGORY.STANDARD,
  tax_rate: 0.1,
}
const voucher = {
  id: 3,
  name: '商品券',
  price: 5000,
  tax_category: TAX_CATEGORY.EXEMPT,
  tax_rate: 0,
}

test('課税商品は税込単価・小計・ラベルを持つ', () => {
  const line = toCartLine(pc, 2)
  assert.equal(line.unitPriceIncluded, 110000)
  assert.equal(line.subtotal, 220000)
  assert.equal(line.label, '税込')
})

test('軽減課税の税込単価', () => {
  const line = toCartLine(flour, 3)
  assert.equal(line.unitPriceIncluded, 216) // 200 + floor(200*0.08)=16
  assert.equal(line.subtotal, 648)
})

test('非課税商品は税込=税抜・ラベルは非課税', () => {
  const line = toCartLine(voucher, 1)
  assert.equal(line.unitPriceIncluded, 5000)
  assert.equal(line.label, '非課税')
})

test('かご合計は各行の小計の和', () => {
  const lines = [toCartLine(pc, 1), toCartLine(flour, 2), toCartLine(voucher, 1)]
  // 110000 + 432 + 5000
  assert.equal(cartTotal(lines), 115432)
})
