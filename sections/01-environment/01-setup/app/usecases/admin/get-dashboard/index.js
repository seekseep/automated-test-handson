// ダッシュボード: 全明細から課税/非課税売上を集計し、注文数を返す。
import { sumSalesByTaxability } from '../../../domain/sales/index.js'

/**
 * @param {import('../../../types.js').Repo} repo データアクセスの窓口
 * @returns {Promise<{ sales: import('../../../types.js').Sales, orderCount: number }>} 売上集計と注文数
 */
export async function getDashboard(repo) {
  const [details, orderCount] = await Promise.all([repo.allOrderDetails(), repo.orderCount()])
  return {
    sales: sumSalesByTaxability(details),
    orderCount,
  }
}
