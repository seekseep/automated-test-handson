import { test } from 'node:test'
import assert from 'node:assert/strict'
import { toCartLine, TAX_CATEGORY } from '../src/cart.js'

// AAA = Arrange（準備）/ Act（実行）/ Assert（検証）。
// 3つのまとまりに分けると「何を・どうしたら・どうなるべきか」が一目で読める。

test('標準課税の商品は税込で表示される', () => {
  // Arrange（準備）：入力を用意する
  const product = { name: 'ノートPC', price: 100000, tax_category: TAX_CATEGORY.STANDARD, tax_rate: 0.1 }

  // Act（実行）：テスト対象を1回だけ呼ぶ
  const line = toCartLine(product)

  // Assert（検証）：結果が期待どおりか確かめる
  assert.equal(line.label, '税込')
  assert.equal(line.total, 110000)
})

test('軽減課税の商品は8%で税込計算される', () => {
  // Arrange
  const product = { name: '小麦粉', price: 200, tax_category: TAX_CATEGORY.REDUCED, tax_rate: 0.08 }

  // Act
  const line = toCartLine(product)

  // Assert
  assert.equal(line.label, '税込')
  assert.equal(line.total, 216) // 200 + floor(200 * 0.08) = 216
})

test('非課税の商品は税込=税抜・ラベルは非課税', () => {
  // Arrange
  const product = { name: '商品券', price: 5000, tax_category: TAX_CATEGORY.EXEMPT, tax_rate: 0 }

  // Act
  const line = toCartLine(product)

  // Assert
  assert.equal(line.label, '非課税')
  assert.equal(line.total, 5000)
})
