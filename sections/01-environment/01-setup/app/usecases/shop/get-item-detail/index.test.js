import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getItemDetail } from './index.js'

test('商品があれば税込価格とラベルを返す', async () => {
  const repo = {
    getItem: () => ({
      id: 2,
      name: 'ノートPC',
      price: 100000,
      tax_category: 'STANDARD',
      tax_rate: 0.1,
    }),
  }
  const detail = await getItemDetail(repo, 2)
  assert.equal(detail.item.name, 'ノートPC')
  assert.equal(detail.priceIncluded, 110000)
  assert.equal(detail.label, '税込')
})

test('非課税商品はラベルが非課税', async () => {
  const repo = {
    getItem: () => ({ id: 6, name: '切符', price: 190, tax_category: 'EXEMPT', tax_rate: 0 }),
  }
  const detail = await getItemDetail(repo, 6)
  assert.equal(detail.priceIncluded, 190)
  assert.equal(detail.label, '非課税')
})

test('商品が無ければ null', async () => {
  const repo = { getItem: () => undefined }
  assert.equal(await getItemDetail(repo, 999), null)
})
