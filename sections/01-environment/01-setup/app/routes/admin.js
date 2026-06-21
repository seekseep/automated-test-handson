// 管理向け: ダッシュボード・注文一覧・注文詳細（HTTP の薄い層。中身は usecase）
import { Hono } from 'hono'
import { repo } from '../db/index.js'
import { getDashboard } from '../usecases/admin/get-dashboard/index.js'
import { listOrders } from '../usecases/admin/list-orders/index.js'
import { getOrderDetail } from '../usecases/admin/get-order-detail/index.js'
import { render } from '../views/render.js'

const admin = new Hono()

admin.get('/admin', async (c) => {
  const data = await getDashboard(repo)
  const content = render('pages/admin-dashboard', data)
  return c.html(content)
})

admin.get('/admin/orders', async (c) => {
  const data = { orders: await listOrders(repo) }
  const content = render('pages/admin-orders', data)
  return c.html(content)
})

admin.get('/admin/orders/:id', async (c) => {
  const data = await getOrderDetail(repo, Number(c.req.param('id')))
  if (!data) return c.notFound()

  const content = render('pages/admin-order-detail', data)
  return c.html(content)
})

export default admin
