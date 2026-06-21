/**
 * トップ: 全商品を返す。
 * @param {import('../../../types.js').Repo} repo データアクセスの窓口
 * @returns {Promise<import('../../../types.js').Item[]>} 全商品
 */
export async function listItems(repo) {
  return repo.allItems()
}
