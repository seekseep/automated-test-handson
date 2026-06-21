import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mock } from 'node:test'
import { placeOrder } from '../src/order.js'

// ロンドン学派（London / mockist）のテスト。
//   - 協力オブジェクト（inventory）は「モック」に差し替える。
//   - 検証するのは「協力オブジェクトをどう呼んだか」＝相互作用（interaction）。
//   - 本物の在庫は用意しない。reserve が正しい引数で呼ばれたかを見る。
//
// 利点 : 協力オブジェクトが重い／未完成でも、対象だけを単体で隔離して試せる。
// 注意 : 実装の呼び出し手順に依存するため、リファクタでテストが壊れやすい（過剰結合に注意）。

test('各明細ぶん reserve が正しい引数で呼ばれる（相互作用を検証）', () => {
  // Arrange: reserve をモック化した偽の在庫を渡す
  const reserve = mock.fn()
  const inventory = { reserve }
  const items = [
    { sku: 'apple', qty: 3, price: 100 },
    { sku: 'banana', qty: 2, price: 200 },
  ]

  // Act
  const result = placeOrder(items, inventory)

  // Assert: 戻り値に加えて「呼ばれ方」を検証する
  assert.equal(result.total, 700)
  assert.equal(reserve.mock.callCount(), 2)
  assert.deepEqual(reserve.mock.calls[0].arguments, ['apple', 3])
  assert.deepEqual(reserve.mock.calls[1].arguments, ['banana', 2])
})

test('在庫不足を表すモックなら例外が伝播する', () => {
  // モックに「呼ばれたら投げる」振る舞いを仕込む
  const reserve = mock.fn(() => {
    throw new Error('在庫不足')
  })
  const items = [{ sku: 'apple', qty: 3, price: 100 }]

  assert.throws(() => placeOrder(items, { reserve }))
})
