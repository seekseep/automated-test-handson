// Eta テンプレートの描画ヘルパー。
// テンプレートは同じディレクトリの *.eta。共通のヘルパー（yen / categories）を毎回注入する。
import { Eta } from 'eta'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const viewsDir = dirname(fileURLToPath(import.meta.url))
const eta = new Eta({ views: viewsDir, cache: false })

/**
 * 金額を「¥1,234」の表記にする（テンプレートから it.yen で使う）。
 * @param {number} n 金額（円）
 * @returns {string} フォーマット済み文字列
 */
const yen = (n) => `¥${Number(n).toLocaleString('ja-JP')}`

/** @type {string[]} トップ/一覧で出すカテゴリ一覧 */
const categories = ['食品', '電化製品', '書籍', 'ギフト', 'チケット']

/**
 * Eta テンプレートを描画する。共通ヘルパー（yen / categories）を毎回注入する。
 * @param {string} template テンプレート名（例: 'pages/top'）
 * @param {Object} [data] テンプレートに渡すデータ
 * @returns {string} 生成された HTML
 */
export function render(template, data = {}) {
  return eta.render(template, { yen, categories, ...data })
}
