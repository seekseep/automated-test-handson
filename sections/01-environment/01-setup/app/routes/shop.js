// 顧客向け: トップ・商品一覧・商品詳細（HTTP の薄い層。中身は usecase）
import { Hono } from 'hono'
import { repo } from '../db/index.js'
import { listItems } from '../usecases/shop/list-items/index.js'
import { searchItems } from '../usecases/shop/search-items/index.js'
import { getItemDetail } from '../usecases/shop/get-item-detail/index.js'
import { render } from '../views/render.js'

const shop = new Hono()

shop.get('/', async (c) => {
  const data = { items: await listItems(repo) }
  const content = render('pages/top', data)
  return c.html(content)
})

shop.get('/items', async (c) => {
  const keyword = c.req.query('keyword') ?? ''
  const category = c.req.query('category') ?? ''
  const data = await searchItems(repo, { keyword, category })
  const content = render('pages/items', data)
  return c.html(content)
})

shop.get('/items/:id', async (c) => {
  const data = await getItemDetail(repo, Number(c.req.param('id')))
  if (!data) return c.notFound()

  const content = render('pages/item-detail', data)
  return c.html(content)
})

export default shop
