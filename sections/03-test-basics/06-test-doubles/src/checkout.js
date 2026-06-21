// テストダブル（モック・スパイ・スタブ・フェイク）を学ぶための題材。
//
// この checkout が「テスト対象（SUT: System Under Test）」。
// checkout は自分だけでは仕事を完結できず、いくつかの「依存コンポーネント
// （DOC: Depended-On Component）」に処理を任せる。
//
//   - getStock        … 在庫数を返す。SUT への「間接入力」をくれる相手
//   - orderRepository … 注文を保存する。状態を持つ相手
//   - mailer          … 受領メールを送る。SUT からの「間接出力」を受け取る相手
//
// 依存をすべて引数（deps）で受け取る＝注入できるようにしておくと、
// テストからはこれらを「テストダブル」に差し替えられる。

/**
 * 注文を確定する。
 * @param {{ email: string, items: { sku: string, qty: number, price: number }[] }} cart
 * @param {{
 *   getStock: (sku: string) => number,           // 在庫数を返す（間接入力の供給元）
 *   orderRepository: { save: (order: object) => object }, // 注文を保存する
 *   mailer: { send: (mail: object) => void },     // メールを送る（間接出力の受け取り手）
 * }} deps
 * @returns {object} 保存された注文
 */
export function checkout(cart, { getStock, orderRepository, mailer }) {
  // 在庫確認：getStock からの戻り値が SUT への「間接入力」。
  // テストでは固定値を返す「スタブ」に差し替えて、在庫あり/なしを自在に作る。
  for (const item of cart.items) {
    if (getStock(item.sku) < item.qty) {
      throw new Error(`在庫不足: ${item.sku}`)
    }
  }

  const total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0)

  // 注文保存：本番では DB だが、テストでは軽量な「フェイク」（インメモリ実装）に置換する。
  const order = orderRepository.save({ email: cart.email, items: cart.items, total })

  // 受領メール送信：mailer.send への呼び出しが SUT からの「間接出力」。
  // 「呼ばれた事実・引数」をあとで検証したいので「スパイ／モック」に差し替える。
  mailer.send({ to: cart.email, subject: '注文を受け付けました', total })

  return order
}
