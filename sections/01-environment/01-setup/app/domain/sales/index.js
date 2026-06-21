// 売上集計のドメインロジック（純粋関数）。
// 課税/非課税は tax_category で振り分ける（税額0かどうかでは判定しない）。
import { isTaxable, taxIncluded } from '../tax/index.js'

/**
 * 注文明細の配列 → 課税/非課税の売上（いずれも税込金額の合計）。
 * @param {import('../../types.js').OrderDetail[]} details
 * @returns {import('../../types.js').Sales}
 */
export function sumSalesByTaxability(details) {
  const result = { taxable: 0, exempt: 0 }
  for (const d of details) {
    const lineTotal = taxIncluded(d.price, d.tax_category, d.tax_rate) * d.quantity
    if (isTaxable(d.tax_category)) {
      result.taxable += lineTotal
    } else {
      result.exempt += lineTotal
    }
  }
  return result
}
