// orders テーブルのクエリ。db（pg の Pool）を第1引数で受け取る。

/** @typedef {import('pg').Pool} DB */
/** @typedef {import('../../types.js').Order} Order */
/** @typedef {import('../../types.js').CartLine} CartLine */

/**
 * 全注文を id 降順（新しい順）で取得する。
 * @param {DB} db pg の接続
 * @returns {Promise<Order[]>} 全注文
 */
export async function allOrders(db) {
  const { rows } = await db.query('SELECT * FROM orders ORDER BY id DESC')
  return rows
}

/**
 * id で1件取得する。
 * @param {DB} db pg の接続
 * @param {number} id 注文ID
 * @returns {Promise<Order | undefined>} 該当注文。無ければ undefined
 */
export async function getOrder(db, id) {
  const { rows } = await db.query('SELECT * FROM orders WHERE id = $1', [id])
  return rows[0]
}

/**
 * 注文の件数を返す。
 * @param {DB} db pg の接続
 * @returns {Promise<number>} 注文件数
 */
export async function orderCount(db) {
  const { rows } = await db.query('SELECT COUNT(*)::int AS n FROM orders')
  return rows[0].n
}

/**
 * 注文＋明細をまとめて作成する（トランザクション）。
 * lines は domain の toCartLine() の結果（unitPrice / taxCategory などを持つ）。
 * @param {DB} db pg の Pool（トランザクション用にクライアントを取得する）
 * @param {string} createdAt 注文日時（'YYYY-MM-DD HH:MM:SS'）
 * @param {number} total 税込合計（円）
 * @param {CartLine[]} lines かごの明細行
 * @returns {Promise<number>} 採番された注文ID
 */
export async function createOrder(db, createdAt, total, lines) {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    const { rows } = await client.query(
      'INSERT INTO orders (created_at, total) VALUES ($1, $2) RETURNING id',
      [createdAt, total],
    )
    const orderId = rows[0].id
    for (const l of lines) {
      await client.query(
        `INSERT INTO order_details (order_id, item_id, name, price, quantity, tax_category, tax_rate)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [orderId, l.itemId, l.name, l.unitPrice, l.quantity, l.taxCategory, l.taxRate],
      )
    }
    await client.query('COMMIT')
    return orderId
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
