import { test } from 'node:test'
import assert from 'node:assert/strict'
import { add, discounted } from '../src/math.js'

// 手順1: はじめてのテスト。これが緑になることを確認する。
test('1 + 1 は 2 になる', () => {
  assert.equal(1 + 1, 2)
})

// 手順1: 自分で書いた関数もテストできる。
test('add は 2 つの数を足す', () => {
  assert.equal(add(1, 1), 2)
  assert.equal(add(100, 200), 300)
})

// 手順3: わざと壊して赤を見る。
//   下の期待値を 300 などに書き換えて `node --test` すると、
//   「期待値と実際の値」が並んだ失敗メッセージが出る。読み方を覚えよう。
test('割引後の金額（端数は切り捨て）', () => {
  assert.equal(discounted(1000, 0.2), 800)
  assert.equal(discounted(199, 0.1), 179) // floor(199 * 0.9) = 179
})
