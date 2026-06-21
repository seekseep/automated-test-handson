# レクチャー: 環境構築と基準アプリ

解説: [docs/01_environment.md](../../../docs/01_environment.md) ／ 仕様: [SPEC.md](./SPEC.md)

## このレクチャーのゴール

`docker compose up` で消費税つきの EC アプリ（顧客向け＋管理画面）が起動し、`node --test` でドメインロジックのテストが緑になることを確認する。これ以降のレクチャーは、ここで整えた環境とアプリを土台に進めます。

> このアプリは「正しく動く・テスト済み」の**基準アプリ**です。`02-experience` ではこれを壊して学びます。

## 手順

### 1. このディレクトリへ

```sh
cd sections/01-environment/01-setup
```

### 2. 起動する

```sh
docker compose up
```

初回は `npm install`（better-sqlite3 のビルド含む）で少し時間がかかります。
`listening on http://localhost:3000` と出れば成功。

### 3. 顧客として買い物してみる

[http://localhost:3000](http://localhost:3000) を開く。

1. トップで「小麦粉」を検索 → 商品一覧
2. 商品をクリックして詳細 → **かごに入れる**
3. [/cart](http://localhost:3000/cart) で税込価格・合計を確認 → **購入する**

### 4. 管理画面で売上を見る

[http://localhost:3000/admin](http://localhost:3000/admin)

- **課税売上・非課税売上・注文数**が出る
- `/admin/orders` → 注文ごとの内訳、`/admin/orders/:id` で明細

### 5. テストを動かす

ホスト側（Node が入っていれば）か、コンテナの中で：

```sh
npm install   # 初回（ホストで動かす場合）
node --test
```

`tax` / `cart` / `sales` のテストが緑になれば OK。

### 6. 止める

```sh
docker compose down
```

## 中身

```
app/
  server.js        … ルートを束ねて起動するだけ
  types.js         … JSDoc 用の型定義（Item / CartLine / Repo など。補完が効く）
  cart-cookie.js   … かごの Cookie 入出力（cart / orders で共有）
  routes/          … HTTP の薄い層（Cookie/クエリ取り出し → usecase → render）
    shop.js        … /, /items, /items/:id
    cart.js        … /cart（追加・表示）
    orders.js      … /orders（購入確定）
    admin.js       … /admin, /admin/orders, /admin/orders/:id
  usecases/        … アプリケーションロジック（repo を引数で注入＝DBなしでテスト可）
    shop/    {list-items, search-items, get-item-detail}/index.js(.test.js)
    cart/    {add-to-cart, view-cart, checkout}/index.js(.test.js)
    admin/   {get-dashboard, list-orders, get-order-detail}/index.js(.test.js)
  views/           … Eta テンプレート（PHP風）
    render.js      … 描画ヘルパー（共通の yen / categories を注入）
    pages/         … ページ（top, items, item-detail, cart, order-done,
                     admin-dashboard, admin-orders, admin-order-detail）
    parts/         … 共通部品（layout, _item-list）
                     ※ページからは ../parts/layout のように相対参照
  domain/          … テストはソースと同じ場所（index.js + index.test.js）
    tax/index.js   tax/index.test.js     … 税額・税込・ラベル・課税判定
    cart/index.js  cart/index.test.js    … かご1行・合計
    sales/index.js sales/index.test.js   … 課税/非課税の売上集計
  assets/style.css … 静的アセット（/assets/* で配信）
db/                … データ層（SQL とクエリを同居）
  sql/
    schema.sql     … テーブル定義（taxes, items, orders, order_details）
    seed.sql       … 初期データ（税率・商品）
  index.js         … 接続・setup・repo（接続を束ねた窓口。usecase に渡す）
  items/index.js          items/index.test.js          … 商品クエリ（taxes を JOIN）
  orders/index.js         orders/index.test.js         … 注文クエリ・createOrder
  order-details/index.js  order-details/index.test.js  … 明細クエリ
data/shop.db       … SQLite（生成物。起動時に空なら自動で作成・投入）
```

## このアプリの肝

課税/非課税は **`tax_category`**（STANDARD / REDUCED / EXEMPT）で判定しています。**税率（`tax_rate`）では判定しません**。
そのため「税率0%の課税商品」でも非課税と混同しません。テスト
`税率0%でも標準課税は課税売上に集計される` がこの仕様を守っています。

> 商品券・**切符（乗車券）**は非課税（EXEMPT）。買い物かごや管理画面で「非課税」として扱われます。

## つまずきポイント

- **ポート 3000 が使用中**: `docker-compose.yml` の `ports` を `"3001:3000"` などに変更。
- **`invalid ELF header`**: ホストの `node_modules` がコンテナに混入したとき。`.dockerignore` で除外済み。`docker compose build --no-cache` で作り直す。
- **データをやり直したい**: `data/shop.db` を削除して再起動すると初期データが入り直る。

## 次へ

[../../02-experience/01-messy-no-test](../../02-experience/01-messy-no-test) — このアプリを題材に、テストなしで壊す体験へ。
