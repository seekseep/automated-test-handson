import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sumSalesByTaxability, TAX_CATEGORY } from '../src/sales.js'

// アサーションは検証したい「形」で選ぶ。
//   プリミティブ → equal / 構造（配列・オブジェクト）→ deepEqual
//   真偽         → ok    / 異常系（例外）           → throws

// equal: 単一の値が等しいか
test('equal: 課税売上の合計額を検証する', () => {
  const orders = [
    { total: 220, tax_rate: 0.1, tax_category: TAX_CATEGORY.STANDARD },
    { total: 110, tax_rate: 0.1, tax_category: TAX_CATEGORY.STANDARD },
  ]

  const sales = sumSalesByTaxability(orders)

  assert.equal(sales.taxable, 330)
})

// deepEqual: オブジェクトの中身がまるごと等しいか
test('deepEqual: 課税と非課税が混ざった注文を正しく振り分ける', () => {
  const orders = [
    { total: 220, tax_rate: 0.1, tax_category: TAX_CATEGORY.STANDARD }, // 課税
    { total: 5000, tax_rate: 0, tax_category: TAX_CATEGORY.EXEMPT }, // 非課税
  ]

  const sales = sumSalesByTaxability(orders)

  assert.deepEqual(sales, { taxable: 220, exempt: 5000 })
})

// ok: 真（truthy）であるか
test('ok: 注文が無ければ課税売上は 0 になる', () => {
  const sales = sumSalesByTaxability([])

  assert.ok(sales.taxable === 0)
  assert.ok(sales.exempt === 0)
})

// throws: 期待どおり例外を投げるか
test('throws: 配列でない入力は例外を投げる', () => {
  assert.throws(() => sumSalesByTaxability(null), TypeError)
})
