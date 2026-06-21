// 注文明細を課税/非課税に振り分けて集計する（02章の題材）。
// 課税/非課税は税率ではなく tax_category で判定する。

export const TAX_CATEGORY = {
  STANDARD: 'STANDARD',
  REDUCED: 'REDUCED',
  EXEMPT: 'EXEMPT',
}

/**
 * 課税対象か（税率ではなく区分で判定）。
 * @param {string} taxCategory
 * @returns {boolean}
 */
export function isTaxable(taxCategory) {
  return taxCategory !== TAX_CATEGORY.EXEMPT
}

/**
 * 注文明細の配列 → { taxable, exempt }（いずれも税込金額の合計）。
 * @param {{ total: number, tax_rate: number, tax_category: string }[]} orders
 * @returns {{ taxable: number, exempt: number }}
 * @throws {TypeError} orders が配列でないとき
 */
export function sumSalesByTaxability(orders) {
  if (!Array.isArray(orders)) {
    throw new TypeError('orders must be an array')
  }
  const sales = { taxable: 0, exempt: 0 }
  for (const order of orders) {
    if (isTaxable(order.tax_category)) {
      sales.taxable += order.total
    } else {
      sales.exempt += order.total
    }
  }
  return sales
}
