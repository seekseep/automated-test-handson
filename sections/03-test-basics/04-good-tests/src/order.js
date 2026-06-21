// 「決定的」なテストを書くためのコツ＝外部依存（時刻）を引数で受け取る。
//
// 悪い例: 関数の中で new Date() を直接呼ぶと、実行する日によって結果が変わり、
//         テストが「ある日突然落ちる」非決定的なものになる。
// 良い例: 現在時刻を引数 now で受け取れば、テストから好きな時刻を渡せる。

/**
 * 注文が当日中（同じ日付）かどうか。
 * @param {Date} orderedAt 注文時刻
 * @param {Date} now 現在時刻（テストから注入できるよう引数で受け取る）
 * @returns {boolean}
 */
export function isSameDay(orderedAt, now) {
  return (
    orderedAt.getFullYear() === now.getFullYear() &&
    orderedAt.getMonth() === now.getMonth() &&
    orderedAt.getDate() === now.getDate()
  )
}
