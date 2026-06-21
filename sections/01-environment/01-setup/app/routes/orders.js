// 顧客向け: 購入確定（かごの中身から注文を作る）。
import { Hono } from 'hono'
import { repo } from '../db/index.js'
import { checkout } from '../usecases/cart/checkout/index.js'
import { readCart, writeCart } from '../cart-cookie.js'
import { render } from '../views/render.js'

const orders = new Hono()

orders.post('/orders', async (c) => {
  const result = await checkout(repo, { entries: readCart(c), now: new Date() })
  if (!result) return c.redirect('/cart')

  writeCart(c, []) // かごを空に
  const content = render('pages/order-done', result)
  return c.html(content)
})

export default orders
