// 購入確定: entries から注文＋明細を作成する。
// かごが空なら null。時刻は now（Date）を受け取って決定的にする。
import { toCartLine, cartTotal } from '../../../domain/cart/index.js'

/**
 * @param {import('../../../types.js').Repo} repo データアクセスの窓口
 * @param {Object} input
 * @param {import('../../../types.js').CartEntry[]} input.entries かごのエントリ一覧
 * @param {Date} input.now 現在時刻（テスト時は固定値を渡せる）
 * @returns {Promise<{ orderId: number, total: number } | null>} 作成した注文。かごが空なら null
 */
export async function checkout(repo, { entries, now }) {
  const resolved = await Promise.all(
    entries.map(async (e) => {
      const item = await repo.getItem(e.itemId)
      return item ? toCartLine(item, e.quantity) : null
    }),
  )
  const lines = resolved.filter(Boolean)
  if (lines.length === 0) return null

  const total = cartTotal(lines)
  const createdAt = now.toISOString().slice(0, 19).replace('T', ' ')
  const orderId = await repo.createOrder(createdAt, total, lines)
  return { orderId, total }
}
