// JSDoc 用の型定義（実行コードなし）。各ファイルから
// `import('.../types.js').Item` のように参照すると補完が効く。

/**
 * 税区分。'STANDARD'（標準課税）/ 'REDUCED'（軽減課税）/ 'EXEMPT'（非課税）。
 * @typedef {'STANDARD' | 'REDUCED' | 'EXEMPT'} TaxCategory
 */

/**
 * 商品（items テーブルの1行）。
 * @typedef {Object} Item
 * @property {number} id 商品ID
 * @property {string} name 商品名
 * @property {string} category カテゴリ
 * @property {number} price 税抜価格（円）
 * @property {TaxCategory} tax_category 税区分
 * @property {number} tax_rate 税率（0.1 / 0.08 / 0 など）
 */

/**
 * かごの1エントリ（Cookie に保存する最小情報）。
 * @typedef {Object} CartEntry
 * @property {number} itemId 商品ID
 * @property {number} quantity 数量
 */

/**
 * かごの表示用1行（domain/cart の toCartLine の戻り値）。
 * @typedef {Object} CartLine
 * @property {number} itemId 商品ID
 * @property {string} name 商品名
 * @property {TaxCategory} taxCategory 税区分
 * @property {number} taxRate 税率
 * @property {number} unitPrice 税抜単価（円）
 * @property {number} unitPriceIncluded 税込単価（円）
 * @property {number} quantity 数量
 * @property {number} subtotal 税込小計（円）
 * @property {string} label 表示ラベル（'税込' か '非課税'）
 */

/**
 * 注文（orders テーブルの1行）。
 * @typedef {Object} Order
 * @property {number} id 注文ID
 * @property {string} created_at 注文日時（'YYYY-MM-DD HH:MM:SS'）
 * @property {number} total 税込合計（円）
 */

/**
 * 注文明細（order_details テーブルの1行）。
 * @typedef {Object} OrderDetail
 * @property {number} id 明細ID
 * @property {number} order_id 注文ID
 * @property {number} item_id 商品ID
 * @property {string} name 購入時の商品名
 * @property {number} price 購入時の税抜単価（円）
 * @property {number} quantity 数量
 * @property {TaxCategory} tax_category 購入時の税区分
 * @property {number} tax_rate 購入時の税率
 */

/**
 * 売上集計（課税/非課税それぞれの税込金額）。
 * @typedef {Object} Sales
 * @property {number} taxable 課税売上（税込・円）
 * @property {number} exempt 非課税売上（税込・円）
 */

/**
 * usecase に渡すデータアクセスの窓口。
 * @typedef {Object} Repo
 * @property {(id: number) => Item | undefined} getItem 商品を1件取得
 * @property {() => Item[]} allItems 全商品を取得
 * @property {(keyword: string, category: string) => Item[]} searchItems 商品を絞り込み取得
 * @property {() => Order[]} allOrders 全注文を取得
 * @property {(id: number) => Order | undefined} getOrder 注文を1件取得
 * @property {() => number} orderCount 注文件数を取得
 * @property {(createdAt: string, total: number, lines: CartLine[]) => number} createOrder 注文＋明細を作成しIDを返す
 * @property {() => OrderDetail[]} allOrderDetails 全明細を取得
 * @property {(orderId: number) => OrderDetail[]} detailsOf 指定注文の明細を取得
 */

export {}
