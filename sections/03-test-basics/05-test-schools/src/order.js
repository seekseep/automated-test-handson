// テスト対象（system under test）。
// 在庫を引き当てつつ、注文の合計金額を計算する。
//
// inventory は協力オブジェクト。これを「本物のまま使う」か「モックにする」かが、
// 古典学派とロンドン学派の分かれ目になる。

/**
 * 注文を確定する。各明細ぶんの在庫を引き当て、合計金額を返す。
 * @param {{ sku: string, qty: number, price: number }[]} items 注文明細
 * @param {{ reserve: (sku: string, qty: number) => void }} inventory 在庫（協力オブジェクト）
 * @returns {{ total: number }}
 */
export function placeOrder(items, inventory) {
  let total = 0
  for (const item of items) {
    inventory.reserve(item.sku, item.qty) // 副作用：協力オブジェクトを呼ぶ
    total += item.price * item.qty
  }
  return { total }
}
