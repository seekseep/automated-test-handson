import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mock } from 'node:test'
import { checkout } from '../src/checkout.js'

// このファイルでは 4 種類のテストダブルを 1 つずつ体現する。
//
//   スタブ   … 間接入力を「操作」する。SUT に決まった値を返して状況を作る。
//   フェイク … 実装を「置換」する。動くけれど軽量な代役（インメモリ実装など）。
//   スパイ   … 間接出力を「記録」する。呼ばれた引数を後から確認する。
//   モック   … 間接出力を「検証」する。期待どおり呼ばれたかを表明する。

// テスト用の共通カート
function makeCart() {
  return {
    email: 'taro@example.com',
    items: [{ sku: 'A-1', qty: 2, price: 500 }],
  }
}

// --- スタブ（Stub）: 間接入力を操作する -------------------------------------
// getStock を「常に在庫 100」を返す関数に差し替え、SUT に都合のよい状況を渡す。
test('スタブ: 在庫を十分返すと注文が確定する', () => {
  const getStock = () => 100 // ← スタブ。中身は問わず固定値を返すだけ
  const orderRepository = { save: (order) => ({ id: 1, ...order }) }
  const mailer = { send: () => {} }

  const order = checkout(makeCart(), { getStock, orderRepository, mailer })

  assert.equal(order.total, 1000)
})

// スタブで「在庫なし」の状況も自在に作れる（実DBを用意しなくてよい）。
test('スタブ: 在庫不足を返すと例外になる', () => {
  const getStock = () => 0 // ← 在庫ゼロを返すスタブ
  const orderRepository = { save: () => ({}) }
  const mailer = { send: () => {} }

  assert.throws(() => checkout(makeCart(), { getStock, orderRepository, mailer }), /在庫不足/)
})

// --- フェイク（Fake）: 実装を置換する ---------------------------------------
// 本番の DB の代わりに、配列に貯めるだけの「動くけど軽い」実装を使う。
function createFakeOrderRepository() {
  const saved = []
  return {
    save(order) {
      const record = { id: saved.length + 1, ...order }
      saved.push(record)
      return record
    },
    all: () => saved, // テストから中身を覗くための補助
  }
}

test('フェイク: インメモリの保存先に注文が記録される', () => {
  const getStock = () => 100
  const orderRepository = createFakeOrderRepository() // ← フェイク
  const mailer = { send: () => {} }

  checkout(makeCart(), { getStock, orderRepository, mailer })

  assert.equal(orderRepository.all().length, 1)
  assert.equal(orderRepository.all()[0].total, 1000)
})

// --- スパイ（Spy）: 間接出力を記録する --------------------------------------
// mock.fn() は呼び出し履歴を記録する。実行後に「何回・どんな引数で呼ばれたか」を見る。
test('スパイ: 受領メールが正しい宛先・金額で送られたか後から確認する', () => {
  const getStock = () => 100
  const orderRepository = { save: (order) => ({ id: 1, ...order }) }
  const send = mock.fn() // ← スパイ。呼び出しをただ記録する
  const mailer = { send }

  checkout(makeCart(), { getStock, orderRepository, mailer })

  // 実行が終わってから記録をたどって検証する（記録 → 後で確認）
  assert.equal(send.mock.callCount(), 1)
  const [mail] = send.mock.calls[0].arguments
  assert.equal(mail.to, 'taro@example.com')
  assert.equal(mail.total, 1000)
})

// --- モック（Mock）: 間接出力を検証する -------------------------------------
// スパイとの違いは「期待」を先に決めておき、そのとおり呼ばれることを表明する点。
// 期待から外れた呼び出し（送らない・宛先違いなど）はテスト失敗にする。
test('モック: 受領メールが期待どおり 1 回だけ呼ばれることを検証する', () => {
  const getStock = () => 100
  const orderRepository = { save: (order) => ({ id: 1, ...order }) }

  // 期待: send は「正しい宛先・件名・金額」で呼ばれること。
  // それ以外の引数で呼ばれたら、この実装自体が assert で落ちる。
  const send = mock.fn((mail) => {
    assert.equal(mail.to, 'taro@example.com')
    assert.equal(mail.subject, '注文を受け付けました')
    assert.equal(mail.total, 1000)
  })
  const mailer = { send }

  checkout(makeCart(), { getStock, orderRepository, mailer })

  // 期待した回数ぴったり呼ばれたことを検証（0 回でも 2 回でも失敗させる）
  assert.equal(send.mock.callCount(), 1)
})
