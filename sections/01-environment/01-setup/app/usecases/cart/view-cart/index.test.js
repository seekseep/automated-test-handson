import { test } from 'node:test'
import assert from 'node:assert/strict'
import { viewCart } from './index.js'

const items = {
  2: { id: 2, name: 'ノートPC', price: 100000, tax_category: 'STANDARD', tax_rate: 0.1 },
  6: { id: 6, name: '切符', price: 190, tax_category: 'EXEMPT', tax_rate: 0 },
}
const repo = { getItem: (id) => items[id] }

test('entries から明細と合計を作る', async () => {
  const { lines, total } = await viewCart(repo, [
    { itemId: 2, quantity: 1 }, // 110000
    { itemId: 6, quantity: 2 }, // 190*2=380（非課税）
  ])
  assert.equal(lines.length, 2)
  assert.equal(total, 110380)
  assert.equal(lines[1].label, '非課税')
})

test('存在しない商品は明細から除外される', async () => {
  const { lines, total } = await viewCart(repo, [{ itemId: 999, quantity: 1 }])
  assert.deepEqual(lines, [])
  assert.equal(total, 0)
})
