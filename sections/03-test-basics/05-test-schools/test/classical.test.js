import { test } from 'node:test'
import assert from 'node:assert/strict'
import { placeOrder } from '../src/order.js'
import { createInventory } from '../src/inventory.js'

// 古典学派（Classical / Detroit）のテスト。
//   - 協力オブジェクト（inventory）は「本物」をそのまま使う。
//   - 検証するのは「最終的な状態と戻り値」＝結果（state）。
//   - 内部でどう呼んだか（reserve を何回呼んだ等）は気にしない。
//
// 利点 : 実装の細部を変えてもテストが壊れにくい（リファクタに強い）。
// 注意 : 本物の協力オブジェクトを用意できる範囲で有効（DB や外部通信は別途切り離す）。

test('注文すると合計金額が返り、引き当てたぶん在庫が減る（状態を検証）', () => {
  // Arrange: 本物の在庫を用意する
  const inventory = createInventory({ apple: 10, banana: 5 })
  const items = [
    { sku: 'apple', qty: 3, price: 100 },
    { sku: 'banana', qty: 2, price: 200 },
  ]

  // Act
  const result = placeOrder(items, inventory)

  // Assert: 戻り値（結果）と、協力オブジェクトの最終状態を検証する
  assert.equal(result.total, 3 * 100 + 2 * 200)
  assert.equal(inventory.getStock('apple'), 7)
  assert.equal(inventory.getStock('banana'), 3)
})

test('在庫が足りなければ例外になる（本物の在庫が判断する）', () => {
  const inventory = createInventory({ apple: 1 })
  const items = [{ sku: 'apple', qty: 3, price: 100 }]

  assert.throws(() => placeOrder(items, inventory))
})
