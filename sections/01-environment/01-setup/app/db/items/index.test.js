import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { reachable, setupSchema, teardownSchema } from '../test-helper.js'
import { getItem, allItems, searchItems } from './index.js'

const SCHEMA = 'test_items'

if (!(await reachable())) {
  test('items db（PostgreSQL 未起動のためスキップ）', { skip: 'docker compose up db で PostgreSQL を起動してください' }, () => {})
} else {
  let pool

  before(async () => {
    pool = await setupSchema(SCHEMA)
    await pool.query(`
      INSERT INTO taxes (id, category, rate) VALUES
        (1, 'STANDARD', 0.1),
        (2, 'REDUCED', 0.08);
      INSERT INTO items (id, name, category, price, tax_id) VALUES
        (1, '小麦粉', '食品', 200, 2),
        (2, 'ノートPC', '電化製品', 100000, 1),
        (3, '緑茶', '食品', 150, 2);
    `)
  })

  after(async () => {
    await teardownSchema(SCHEMA, pool)
  })

  test('getItem は id で1件取得し、JOIN で税区分・税率を埋める', async () => {
    const item = await getItem(pool, 2)
    assert.equal(item.name, 'ノートPC')
    assert.equal(item.tax_category, 'STANDARD')
    assert.equal(item.tax_rate, 0.1)
  })

  test('allItems は id 昇順で全件', async () => {
    const result = await allItems(pool)
    assert.deepEqual(
      result.map((i) => i.id),
      [1, 2, 3],
    )
  })

  test('searchItems: keyword は名前の部分一致', async () => {
    assert.equal((await searchItems(pool, '小麦', '')).length, 1)
  })

  test('searchItems: category で絞り込み', async () => {
    assert.equal((await searchItems(pool, '', '食品')).length, 2)
  })

  test('searchItems: keyword と category の両方', async () => {
    assert.equal((await searchItems(pool, '緑茶', '食品')).length, 1)
  })
}
