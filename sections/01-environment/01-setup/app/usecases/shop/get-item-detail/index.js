// 商品詳細: 商品＋税込価格＋ラベル。見つからなければ null。
import { toCartLine } from '../../../domain/cart/index.js'

/**
 * @param {import('../../../types.js').Repo} repo データアクセスの窓口
 * @param {number} id 商品ID
 * @returns {Promise<{ item: import('../../../types.js').Item, priceIncluded: number, label: string } | null>} 詳細。無ければ null
 */
export async function getItemDetail(repo, id) {
  const item = await repo.getItem(id)
  if (!item) return null
  const line = toCartLine(item, 1)
  return { item, priceIncluded: line.unitPriceIncluded, label: line.label }
}
