// 商品一覧: keyword / category があれば絞り込み、無ければ全件。
// 戻り値はそのまま items.eta に渡せる形にする。

/**
 * @param {import('../../../types.js').Repo} repo データアクセスの窓口
 * @param {Object} query 検索条件
 * @param {string} [query.keyword] 検索キーワード（商品名の部分一致）
 * @param {string} [query.category] カテゴリ（完全一致）
 * @returns {Promise<{ items: import('../../../types.js').Item[], keyword: string, category: string }>} 一覧と検索条件
 */
export async function searchItems(repo, { keyword = '', category = '' } = {}) {
  const items = keyword || category ? await repo.searchItems(keyword, category) : await repo.allItems()
  return { items, keyword, category }
}
