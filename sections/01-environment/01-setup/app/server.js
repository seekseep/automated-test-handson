import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'

import { setup } from './db/index.js'
import shop from './routes/shop.js'
import cart from './routes/cart.js'
import orders from './routes/orders.js'
import admin from './routes/admin.js'

await setup() // スキーマ作成＋初期データ投入（空のときだけ）。Postgres 接続が整うまで待つ

const app = new Hono()

// ルートをファイルごとに分けてマウント
app.route('/', shop) // /, /items, /items/:id
app.route('/', cart) // /cart
app.route('/', orders) // /orders
app.route('/', admin) // /admin, /admin/orders, /admin/orders/:id

// その他
app.get('/healthz', (c) => c.json({ status: 'ok' }))
// 静的アセット（app/assets/ 配下を /assets/* で配信）
app.use('/assets/*', serveStatic({ root: './app' }))

const port = Number(process.env.PORT ?? 3000)
serve({ fetch: app.fetch, port, hostname: '0.0.0.0' }, (info) => {
  console.log(`listening on http://localhost:${info.port}`)
})
