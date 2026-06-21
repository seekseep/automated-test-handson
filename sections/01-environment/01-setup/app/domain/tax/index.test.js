import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TAX_CATEGORY, isTaxable, taxLabel, taxAmount, taxIncluded } from './index.js'

test('標準課税の税額は floor(price * rate)', () => {
  assert.equal(taxAmount(200, TAX_CATEGORY.STANDARD, 0.1), 20)
  assert.equal(taxIncluded(200, TAX_CATEGORY.STANDARD, 0.1), 220)
})

test('軽減課税は端数を切り捨てる', () => {
  // 199 * 0.08 = 15.92 -> 15
  assert.equal(taxAmount(199, TAX_CATEGORY.REDUCED, 0.08), 15)
  assert.equal(taxIncluded(199, TAX_CATEGORY.REDUCED, 0.08), 214)
})

test('非課税は税額0・税率を渡しても0', () => {
  assert.equal(taxAmount(5000, TAX_CATEGORY.EXEMPT, 0.1), 0)
  assert.equal(taxIncluded(5000, TAX_CATEGORY.EXEMPT, 0.1), 5000)
})

test('税率0%でも標準課税は「課税」のまま', () => {
  // 税率0%の課税商品（例: 減税）。税額は0だが区分は STANDARD。
  assert.equal(isTaxable(TAX_CATEGORY.STANDARD), true)
  assert.equal(taxLabel(TAX_CATEGORY.STANDARD), '税込')
  assert.equal(taxAmount(1000, TAX_CATEGORY.STANDARD, 0), 0)
  assert.equal(taxIncluded(1000, TAX_CATEGORY.STANDARD, 0), 1000)
})

test('ラベルは区分で決まる', () => {
  assert.equal(taxLabel(TAX_CATEGORY.STANDARD), '税込')
  assert.equal(taxLabel(TAX_CATEGORY.REDUCED), '税込')
  assert.equal(taxLabel(TAX_CATEGORY.EXEMPT), '非課税')
})
