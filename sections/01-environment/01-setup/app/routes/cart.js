// 顧客向け: 買い物かご（追加・表示）。購入は orders.js。
import { Hono } from 'hono'
import { repo } from '../db/index.js'
import { addToCart } from '../usecases/cart/add-to-cart/index.js'
import { viewCart } from '../usecases/cart/view-cart/index.js'
import { readCart, writeCart } from '../cart-cookie.js'
import { render } from '../views/render.js'

const cart = new Hono()

cart.post('/cart', async (c) => {
  const body = await c.req.parseBody()
  const itemId = Number(body.itemId)
  const quantity = Math.max(1, Number(body.quantity) || 1)
  const entries = await addToCart(repo, { entries: readCart(c), itemId, quantity })
  writeCart(c, entries)
  return c.redirect('/cart')
})

cart.get('/cart', async (c) => {
  const data = await viewCart(repo, readCart(c))
  const content = render('pages/cart', data)
  return c.html(content)
})

export default cart
