import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isSameDay } from '../src/order.js'

// 良いテストの性質を、このファイルで体現する。
//   - 速い        : 純粋関数だけを呼ぶ（DB も通信も無い）
//   - 決定的      : 時刻を引数で渡すので、いつ実行しても同じ結果
//   - 1つを検証   : 1テスト＝1つの観点。落ちたら原因が一目で分かる
//   - 名前が仕様  : テスト名だけで「何を保証しているか」が読める

// 名前が仕様になっている例。固定の時刻を渡すので決定的。
test('注文時刻と現在時刻が同じ日付なら当日と判定する', () => {
  const orderedAt = new Date('2026-06-21T09:00:00')
  const now = new Date('2026-06-21T23:59:59')

  assert.equal(isSameDay(orderedAt, now), true)
})

// 観点ごとにテストを分ける（1テスト1検証）。
test('日付をまたいでいれば当日ではないと判定する', () => {
  const orderedAt = new Date('2026-06-21T23:59:59')
  const now = new Date('2026-06-22T00:00:00')

  assert.equal(isSameDay(orderedAt, now), false)
})

// 悪い例（参考）：もし isSameDay が内部で new Date() を呼んでいたら、
// 下のように「今日」を前提にしたテストになり、別の日に実行すると落ちる。
// 時刻を引数で受け取る設計にすることで、この非決定性を避けている。
//
//   test('当日の注文は当日と判定される', () => {
//     const orderedAt = new Date() // ← 実行日に依存。非決定的
//     assert.equal(isSameDayUsingGlobalClock(orderedAt), true)
//   })
