// 02章と同じ題材（消費税の EC）を、AAA を学ぶために小さく作り直したもの。
// 課税/非課税は税率ではなく tax_category で判定する。

export const TAX_CATEGORY = {
  STANDARD: 'STANDARD', // 標準課税（例: 10%）
  REDUCED: 'REDUCED', // 軽減課税（例: 8%）
  EXEMPT: 'EXEMPT', // 非課税
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
 * 商品 → 表示用のかご1行 { label, total }。
 * @param {{ name: string, price: number, tax_category: string, tax_rate: number }} product
 * @returns {{ name: string, label: string, total: number }}
 */
export function toCartLine(product) {
  const taxable = isTaxable(product.tax_category)
  const tax = taxable ? Math.floor(product.price * product.tax_rate) : 0
  return {
    name: product.name,
    label: taxable ? '税込' : '非課税',
    total: product.price + tax,
  }
}
