// 練習用の小さな純粋関数。

/**
 * 足し算。
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function add(a, b) {
  return a + b
}

/**
 * 割引後の金額（端数切り捨て）。
 * @param {number} price 元の金額
 * @param {number} rate 割引率（0〜1）
 * @returns {number}
 */
export function discounted(price, rate) {
  return Math.floor(price * (1 - rate))
}
