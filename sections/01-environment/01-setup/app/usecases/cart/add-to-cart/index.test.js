import { test } from 'node:test'
import assert from 'node:assert/strict'
import { addToCart } from './index.js'

const repoWithItem = { getItem: () => ({ id: 1 }) }

test('新しい商品は entries に追加される', async () => {
  const result = await addToCart(repoWithItem, { entries: [], itemId: 1, quantity: 2 })
  assert.deepEqual(result, [{ itemId: 1, quantity: 2 }])
})

test('既にある商品は数量が加算される', async () => {
  const result = await addToCart(repoWithItem, {
    entries: [{ itemId: 1, quantity: 1 }],
    itemId: 1,
    quantity: 2,
  })
  assert.deepEqual(result, [{ itemId: 1, quantity: 3 }])
})

test('元の entries は破壊しない', async () => {
  const entries = [{ itemId: 1, quantity: 1 }]
  await addToCart(repoWithItem, { entries, itemId: 1, quantity: 5 })
  assert.deepEqual(entries, [{ itemId: 1, quantity: 1 }])
})

test('存在しない商品は無視（entries をそのまま返す）', async () => {
  const repo = { getItem: () => undefined }
  const entries = [{ itemId: 1, quantity: 1 }]
  assert.equal(await addToCart(repo, { entries, itemId: 999, quantity: 1 }), entries)
})
