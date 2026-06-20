import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { html } from 'hono/html'

const app = new Hono()

// サンプル商品（このレクチャーはDBなし。環境が動くことの確認用）
const items = [
  { id: 1, name: '薄力粉 750g', category: '食品', price: 200 },
  { id: 2, name: 'ノートPC', category: '電化製品', price: 100000 },
  { id: 3, name: '雑誌', category: '書籍', price: 800 },
]

const yen = (n) => `¥${n.toLocaleString('ja-JP')}`

const layout = (title, body) => html`<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <header><a href="/" class="brand">🛒 サンプルショップ</a></header>
    <main>${body}</main>
    <footer>環境構築の確認用サンプル（01-environment / 01-setup）</footer>
  </body>
</html>`

app.get('/', (c) =>
  c.html(
    layout(
      'サンプルショップ',
      html`
        <p class="ok">✅ Web アプリが起動しています。環境構築は成功です。</p>
        <h1>商品一覧</h1>
        <ul class="items">
          ${items.map(
            (item) => html`
              <li>
                <span class="name">${item.name}</span>
                <span class="cat">${item.category}</span>
                <span class="price">${yen(item.price)}</span>
              </li>
            `,
          )}
        </ul>
        <p class="note">
          これは起動確認用の最小サンプルです。買い物かご・消費税・管理画面は
          <code>02-experience</code> で扱います。
        </p>
      `,
    ),
  ),
)

// 動作確認用のヘルスチェック
app.get('/healthz', (c) => c.json({ status: 'ok' }))

// 静的ファイル（CSS）
app.use('/style.css', serveStatic({ path: './app/public/style.css' }))

const port = Number(process.env.PORT ?? 3000)
serve({ fetch: app.fetch, port, hostname: '0.0.0.0' }, (info) => {
  console.log(`listening on http://localhost:${info.port}`)
})
