// 注文が在庫を引き当てる先（協力オブジェクト＝collaborator）。
//
// 古典学派のテストでは、この「本物」を使って最終的な状態（残在庫）を検証する。
// ロンドン学派のテストでは、これをモックに差し替えて「呼ばれ方」を検証する。

/**
 * メモリ上の在庫を作る。
 * @param {Record<string, number>} initialStock SKU ごとの初期在庫
 */
export function createInventory(initialStock = {}) {
  const stock = { ...initialStock }
  return {
    /** 在庫を引き当てる（足りなければ例外） */
    reserve(sku, qty) {
      if ((stock[sku] ?? 0) < qty) {
        throw new Error(`在庫不足: ${sku}`)
      }
      stock[sku] -= qty
    },
    /** 現在の残在庫を返す（検証用） */
    getStock(sku) {
      return stock[sku] ?? 0
    },
  }
}
