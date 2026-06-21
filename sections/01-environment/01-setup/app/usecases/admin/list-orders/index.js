// 注文一覧: 各注文に課税/非課税の売上内訳を付けて返す。
import { sumSalesByTaxability } from '../../../domain/sales/index.js'

/**
 * @param {import('../../../types.js').Repo} repo データアクセスの窓口
 * @returns {Promise<Array<import('../../../types.js').Order & { sales: import('../../../types.js').Sales }>>} 売上内訳つき注文一覧
 */
export async function listOrders(repo) {
  const orders = await repo.allOrders()
  return Promise.all(
    orders.map(async (o) => ({
      ...o,
      sales: sumSalesByTaxability(await repo.detailsOf(o.id)),
    })),
  )
}
