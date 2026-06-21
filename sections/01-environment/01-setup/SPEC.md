# 01-setup 仕様

環境確認をかねた**基準アプリ**。顧客向け EC と、課税売上を集計する管理画面を持つ。
ここでは「正しく動く・テスト済み」の状態をつくる。`02-experience` はこのアプリを壊して学ぶ。

## 方針

- Hono + Eta テンプレート（PHP のように毎回サーバーで HTML を組んで返す）。クライアント JS フレームワークなし。ビューはページごとに `app/views/*.eta` に分割。
- データは PostgreSQL（`pg`）。compose の `db` サービスに保存。スキーマ・初期データは `db/schema.sql` / `db/seed.sql` に分離し、`app/db/index.js` が起動時に読み込む（初期データは空のときだけ投入）。接続先は `DATABASE_URL`。DB アクセスは非同期（repo・usecase は Promise を返す）。
- 課税/非課税の判定は **`tax_category`** で行う（`tax_rate` の正負では判定しない）。これが本ハンズオンの肝。
- 税率は `taxes` テーブルに集約し、`items` は `tax_id` で参照する（多対1）。
- ドメインロジック（税計算・かご・売上集計）は純粋関数に切り出し、`node:test` でテストする。テストはソースと同じ場所に置く（`xxx/index.js` と `xxx/index.test.js`）。
- レイヤ構成: `routes`（HTTP）→ `usecases`（アプリケーションロジック）→ `db`（接続を束ねた repo）＋ `domain`（純粋ロジック）。usecase は repo を引数で受け取る（DI）ので、偽 repo を渡せば DB なしでテストできる。型は `app/types.js` に JSDoc の typedef を置き、各関数に `@param`/`@returns` を付けて補完を効かせる。

## 税区分（tax_category）

| 区分       | 意味     | 税率の例 | 表示ラベル | 売上集計   |
| ---------- | -------- | -------- | ---------- | ---------- |
| `STANDARD` | 標準課税 | 10%      | 税込       | 課税売上   |
| `REDUCED`  | 軽減課税 | 8%       | 税込       | 課税売上   |
| `EXEMPT`   | 非課税   | ―        | 非課税     | 非課税売上 |

> 「税率が 0% の課税商品」も区分は `STANDARD`/`REDUCED` のまま。**税率では非課税と区別できない**ので、必ず `tax_category` で判定する。

## データモデル（PostgreSQL）

```
taxes(id, category, rate)                  -- 税区分ごとに1行（STANDARD/REDUCED/EXEMPT）
items(id, name, category, price[税抜], tax_id → taxes.id)
orders(id, created_at, total[税込合計])
order_details(id, order_id, item_id, name, price[税抜], quantity, tax_category, tax_rate)
```

- 税率は `taxes` に集約し、`items` は `tax_id` で参照する（item _ --- 1 tax）。税率変更は `taxes` の1行 UPDATE で全商品に反映。
- 商品クエリは `taxes` を JOIN して `tax_category` / `tax_rate` を返すので、ドメイン/usecase からは税率の置き場所を意識しない。
- **`order_details` は購入時の `tax_category` / `tax_rate` をコピー保存する**（`tax_id` は参照しない）。後で `taxes` を変えても過去の注文は購入時の条件で残す（経理履歴の正しさ）。

## 画面（ルート）

### 顧客向け

| メソッド | パス         | 役割                                        |
| -------- | ------------ | ------------------------------------------- |
| GET      | `/`          | トップ。検索フォーム・カテゴリ・商品一覧    |
| GET      | `/items`     | 一覧（`?keyword=` `?category=` で絞り込み） |
| GET      | `/items/:id` | 商品詳細・かごに入れる                      |
| POST     | `/cart`      | かごに追加（Cookie 保存）→ `/cart`          |
| GET      | `/cart`      | 買い物かご。税込価格・合計・購入ボタン      |
| POST     | `/orders`    | 購入確定。注文＋明細を保存し、かごを空に    |

### 管理向け

| メソッド | パス                | 役割                                             |
| -------- | ------------------- | ------------------------------------------------ |
| GET      | `/admin`            | ダッシュボード。**課税売上・非課税売上・注文数** |
| GET      | `/admin/orders`     | 注文一覧（各注文の税込合計・課税/非課税内訳）    |
| GET      | `/admin/orders/:id` | 注文詳細（明細ごとの区分・税込）                 |

> 01-setup ではログインは省略（最小構成）。ログイン付きの管理画面は `02-experience` で扱う。

## ドメインロジック（テスト対象）

- `app/domain/tax/index.js`（テスト: `tax/index.test.js`）
  - `taxAmount(price, taxCategory, taxRate)` … 非課税は 0、それ以外は `floor(price * taxRate)`
  - `taxIncluded(price, taxCategory, taxRate)` … 税込単価
  - `taxLabel(taxCategory)` … `非課税` か `税込`
  - `isTaxable(taxCategory)` … 課税なら true
- `app/domain/cart/index.js`（テスト: `cart/index.test.js`）
  - `toCartLine(item, quantity)` … 表示用の1行（税込単価・小計・ラベル）
  - `cartTotal(lines)` … 税込合計
- `app/domain/sales/index.js`（テスト: `sales/index.test.js`）
  - `sumSalesByTaxability(details)` … `{ taxable, exempt }`（`tax_category` で振り分け）

## テスト観点（抜粋）

- 標準・軽減・非課税それぞれの税額・ラベル
- **税率 0% でも `STANDARD` は「税込」表示・課税売上**（非課税と混同しない）
- 端数（`floor`）
- かご合計（複数明細・数量）
- 売上集計（課税/非課税の振り分け、混在）
