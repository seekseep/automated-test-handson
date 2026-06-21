// かごに追加: 既存の entries に itemId を足した新しい entries を返す。
// 存在しない商品は無視する（entries を変えない）。entries は破壊しない。

/**
 * @param {import('../../../types.js').Repo} repo データアクセスの窓口
 * @param {Object} input
 * @param {import('../../../types.js').CartEntry[]} input.entries 現在のかご
 * @param {number} input.itemId 追加する商品ID
 * @param {number} input.quantity 追加する数量
 * @returns {Promise<import('../../../types.js').CartEntry[]>} 追加後のかご
 */
export async function addToCart(repo, { entries, itemId, quantity }) {
  if (!(await repo.getItem(itemId))) return entries
  const next = entries.map((e) => ({ ...e }))
  const existing = next.find((e) => e.itemId === itemId)
  if (existing) existing.quantity += quantity
  else next.push({ itemId, quantity })
  return next
}
