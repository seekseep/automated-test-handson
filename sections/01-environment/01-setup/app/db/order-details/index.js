// order_details テーブルのクエリ（読み取り）。db を第1引数で受け取る。
// 明細の作成は orders/createOrder がトランザクションでまとめて行う。

/** @typedef {import('pg').Pool | import('pg').PoolClient} DB */
/** @typedef {import('../../types.js').OrderDetail} OrderDetail */

/**
 * 全明細を取得する。
 * @param {DB} db pg の接続
 * @returns {Promise<OrderDetail[]>} 全注文の明細
 */
export async function allOrderDetails(db) {
  const { rows } = await db.query('SELECT * FROM order_details')
  return rows
}

/**
 * 指定した注文の明細を id 昇順で取得する。
 * @param {DB} db pg の接続
 * @param {number} orderId 注文ID
 * @returns {Promise<OrderDetail[]>} その注文の明細
 */
export async function detailsOf(db, orderId) {
  const { rows } = await db.query(
    'SELECT * FROM order_details WHERE order_id = $1 ORDER BY id',
    [orderId],
  )
  return rows
}
