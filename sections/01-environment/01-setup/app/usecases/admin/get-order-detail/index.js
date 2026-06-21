// 注文詳細: 注文＋明細（税込小計つき）＋売上内訳。見つからなければ null。
import { sumSalesByTaxability } from '../../../domain/sales/index.js'
import { taxIncluded } from '../../../domain/tax/index.js'

/**
 * @typedef {import('../../../types.js').OrderDetail & { lineTotal: number }} OrderDetailWithTotal
 */

/**
 * @param {import('../../../types.js').Repo} repo データアクセスの窓口
 * @param {number} id 注文ID
 * @returns {Promise<{ order: import('../../../types.js').Order, details: OrderDetailWithTotal[], sales: import('../../../types.js').Sales } | null>} 注文詳細。無ければ null
 */
export async function getOrderDetail(repo, id) {
  const order = await repo.getOrder(id)
  if (!order) return null
  const details = (await repo.detailsOf(order.id)).map((d) => ({
    ...d,
    lineTotal: taxIncluded(d.price, d.tax_category, d.tax_rate) * d.quantity,
  }))
  return { order, details, sales: sumSalesByTaxability(details) }
}
