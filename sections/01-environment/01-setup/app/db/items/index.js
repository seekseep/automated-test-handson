// items テーブルのクエリ。db（pg の Pool か Client）を第1引数で受け取る。
// 税率は taxes テーブルにあるので JOIN して tax_category / tax_rate を取り出す。
// （戻り値の形は Item のまま。ドメイン/usecase 側は税率がどこにあるか意識しない）

/** @typedef {import('pg').Pool | import('pg').PoolClient} DB */
/** @typedef {import('../../types.js').Item} Item */

// items に taxes を結合し、tax_category / tax_rate を埋めた1行を取り出す共通 SELECT。
const SELECT_ITEM = `
  SELECT i.id, i.name, i.category, i.price,
         t.category AS tax_category, t.rate AS tax_rate
  FROM items i
  JOIN taxes t ON i.tax_id = t.id`

/**
 * id で1件取得する。
 * @param {DB} db pg の接続
 * @param {number} id 商品ID
 * @returns {Promise<Item | undefined>} 該当商品。無ければ undefined
 */
export async function getItem(db, id) {
  const { rows } = await db.query(`${SELECT_ITEM} WHERE i.id = $1`, [id])
  return rows[0]
}

/**
 * 全商品を id 昇順で取得する。
 * @param {DB} db pg の接続
 * @returns {Promise<Item[]>} 全商品
 */
export async function allItems(db) {
  const { rows } = await db.query(`${SELECT_ITEM} ORDER BY i.id`)
  return rows
}

/**
 * keyword（名前の部分一致）と category で絞り込む。空文字なら条件に含めない。
 * @param {DB} db pg の接続
 * @param {string} keyword 検索キーワード（商品名の部分一致）
 * @param {string} category カテゴリ（完全一致）
 * @returns {Promise<Item[]>} 絞り込み結果
 */
export async function searchItems(db, keyword, category) {
  let sql = `${SELECT_ITEM} WHERE 1=1`
  const params = []
  if (keyword) {
    params.push(`%${keyword}%`)
    sql += ` AND i.name LIKE $${params.length}`
  }
  if (category) {
    params.push(category)
    sql += ` AND i.category = $${params.length}`
  }
  sql += ' ORDER BY i.id'
  const { rows } = await db.query(sql, params)
  return rows
}
