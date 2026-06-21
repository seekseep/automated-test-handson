// 消費税まわりのドメインロジック（純粋関数）。
// 課税/非課税は必ず tax_category で判定する。tax_rate の正負で判定しない。

/** @typedef {import('../../types.js').TaxCategory} TaxCategory */

export const TAX_CATEGORY = {
  STANDARD: 'STANDARD', // 標準課税（例: 10%）
  REDUCED: 'REDUCED', // 軽減課税（例: 8%）
  EXEMPT: 'EXEMPT', // 非課税
}

/**
 * 課税対象か（税率ではなく区分で判定する）。
 * @param {TaxCategory} taxCategory
 * @returns {boolean}
 */
export function isTaxable(taxCategory) {
  return taxCategory !== TAX_CATEGORY.EXEMPT
}

/**
 * 表示ラベル。
 * @param {TaxCategory} taxCategory
 * @returns {string} '税込' か '非課税'
 */
export function taxLabel(taxCategory) {
  return isTaxable(taxCategory) ? '税込' : '非課税'
}

/**
 * 税額（非課税は常に 0。課税は端数切り捨て）。
 * @param {number} price 税抜価格
 * @param {TaxCategory} taxCategory
 * @param {number} taxRate
 * @returns {number}
 */
export function taxAmount(price, taxCategory, taxRate) {
  if (!isTaxable(taxCategory)) return 0
  return Math.floor(price * taxRate)
}

/**
 * 税込単価。
 * @param {number} price 税抜価格
 * @param {TaxCategory} taxCategory
 * @param {number} taxRate
 * @returns {number}
 */
export function taxIncluded(price, taxCategory, taxRate) {
  return price + taxAmount(price, taxCategory, taxRate)
}
