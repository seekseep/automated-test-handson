import { test } from 'node:test'
import assert from 'node:assert/strict'
import { listItems } from './index.js'

test('repo.allItems の結果をそのまま返す', async () => {
  const items = [{ id: 1 }, { id: 2 }]
  const repo = { allItems: () => items }
  assert.equal(await listItems(repo), items)
})
