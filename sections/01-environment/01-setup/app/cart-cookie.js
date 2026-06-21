// 買い物かごの Cookie 入出力（HTTP 層の責務）。cart / orders ルートで共有する。
import { getCookie, setCookie } from 'hono/cookie'

/** @typedef {import('hono').Context} Context */
/** @typedef {import('./types.js').CartEntry} CartEntry */

/**
 * Cookie からかごの中身を読む。未設定や壊れたデータなら空配列を返す。
 * @param {Context} c Hono のコンテキスト
 * @returns {CartEntry[]} かごのエントリ一覧
 */
export function readCart(c) {
  const raw = getCookie(c, 'cart')
  if (!raw) return []
  try {
    const parsed = JSON.parse(decodeURIComponent(raw))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * かごの中身を Cookie に書き込む。
 * @param {Context} c Hono のコンテキスト
 * @param {CartEntry[]} entries 保存するエントリ一覧
 * @returns {void}
 */
export function writeCart(c, entries) {
  setCookie(c, 'cart', encodeURIComponent(JSON.stringify(entries)), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
  })
}
