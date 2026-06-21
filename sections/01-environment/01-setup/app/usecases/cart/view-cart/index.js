// かご表示: entries（[{itemId, quantity}]）から明細行と合計を作る。
import { toCartLine, cartTotal } from '../../../domain/cart/index.js'

/**
 * @param {import('../../../types.js').Repo} repo データアクセスの窓口
 * @param {import('../../../types.js').CartEntry[]} entries かごのエントリ一覧
 * @returns {Promise<{ lines: import('../../../types.js').CartLine[], total: number }>} 明細行と税込合計
 */
export async function viewCart(repo, entries) {
  const resolved = await Promise.all(
    entries.map(async (e) => {
      const item = await repo.getItem(e.itemId)
      return item ? toCartLine(item, e.quantity) : null
    }),
  )
  const lines = resolved.filter(Boolean)
  return { lines, total: cartTotal(lines) }
}
