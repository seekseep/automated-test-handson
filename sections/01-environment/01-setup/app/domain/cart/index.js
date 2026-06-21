// 買い物かごのドメインロジック（純粋関数）。
import { taxIncluded, taxLabel } from '../tax/index.js'

/**
 * 商品 + 数量 → 表示用のかご1行。
 * @param {import('../../types.js').Item} item
 * @param {number} quantity
 * @returns {import('../../types.js').CartLine}
 */
export function toCartLine(item, quantity) {
  const unitPriceIncluded = taxIncluded(item.price, item.tax_category, item.tax_rate)
  return {
    itemId: item.id,
    name: item.name,
    taxCategory: item.tax_category,
    taxRate: item.tax_rate,
    unitPrice: item.price, // 税抜
    unitPriceIncluded, // 税込
    quantity,
    subtotal: unitPriceIncluded * quantity, // 税込小計
    label: taxLabel(item.tax_category),
  }
}

/**
 * かごの税込合計。
 * @param {import('../../types.js').CartLine[]} lines
 * @returns {number}
 */
export function cartTotal(lines) {
  return lines.reduce((sum, line) => sum + line.subtotal, 0)
}
