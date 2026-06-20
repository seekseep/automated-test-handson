# レクチャー: 環境構築の確認

解説: [docs/01_environment.md](../../../docs/01_environment.md)

## このレクチャーのゴール

`docker compose up` でサンプルの Web アプリが起動し、ブラウザで見えることを確認する。これ以降のレクチャーは、ここで整えた環境の上で進めます。

> このレクチャーにテストはありません。「まず動かす」ことだけが目的です。

## 使うもの

- Docker Desktop（Compose 込み）
- ブラウザ

## 手順

### 1. このディレクトリに移動

```sh
cd sections/01-environment/01-setup
```

### 2. 起動する

```sh
docker compose up
```

初回はイメージのビルド（`npm install`）が走るため少し時間がかかります。
`listening on http://localhost:3000` と出れば起動成功です。

### 3. ブラウザで確認

[http://localhost:3000](http://localhost:3000) を開きます。

- 「✅ Web アプリが起動しています」と商品一覧（薄力粉・ノートPC・雑誌）が表示されれば OK。

### 4. 止める

別ターミナルで、または `Ctrl + C` のあとに：

```sh
docker compose down
```

## 中身（軽く）

- `app/server.js` … Hono のアプリ本体。`/` でサンプル商品一覧の HTML を返す
- `app/public/style.css` … 見た目
- `Dockerfile` / `docker-compose.yml` … 起動環境

サーバが HTML を返すだけの、PHP のような素朴な構成です。買い物かご・消費税・管理画面は次の `02-experience` で扱います。

## つまずきポイント

- **ポート 3000 が使われている**: 別のアプリが使っていると起動に失敗します。停止するか、`docker-compose.yml` の `ports` を `"3001:3000"` などに変更してください。
- **変更が反映されない**: `app/` 配下はマウントしているので保存で反映されます。`Dockerfile` や依存を変えたときは `docker compose up --build` で再ビルドします。

## 次へ

[../../02-experience/01-messy-no-test](../../02-experience/01-messy-no-test) — テストなしで機能追加して壊す体験へ。
