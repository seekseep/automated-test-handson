import { test } from 'node:test'
import assert from 'node:assert/strict'
import { searchItems } from './index.js'

test('keyword も category も無ければ全件（allItems）', async () => {
  const repo = {
    allItems: () => [{ id: 1 }, { id: 2 }],
    searchItems: () => assert.fail('searchItems は呼ばれないはず'),
  }
  const result = await searchItems(repo, {})
  assert.equal(result.items.length, 2)
  assert.equal(result.keyword, '')
  assert.equal(result.category, '')
})

test('keyword があれば searchItems で絞り込む', async () => {
  const calls = []
  const repo = {
    allItems: () => assert.fail('allItems は呼ばれないはず'),
    searchItems: (k, cat) => {
      calls.push([k, cat])
      return [{ id: 1, name: '小麦粉' }]
    },
  }
  const result = await searchItems(repo, { keyword: '小麦粉', category: '' })
  assert.deepEqual(calls, [['小麦粉', '']])
  assert.equal(result.items.length, 1)
  assert.equal(result.keyword, '小麦粉')
})
