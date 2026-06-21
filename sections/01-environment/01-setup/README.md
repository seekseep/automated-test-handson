# 01-setup

消費税つき EC ＋ 課税売上の管理画面を持つ**基準アプリ**（Hono + PostgreSQL）。正しく動き、ドメインロジックは `node:test` でテスト済み。`02-experience` はこれを壊して学ぶ土台。

```sh
cd sections/01-environment/01-setup
docker compose up          # → http://localhost:3000 （/admin に管理画面）
                           #   http://localhost:8080 で DB を閲覧（pgAdmin）
node --test                # ドメイン・ユースケース・DB層のテスト
```

> `docker compose up` で **app（:3000）** / **db（PostgreSQL :5432）** / **db-viewer（pgAdmin :8080）** が起動する。
> pgAdmin はログイン不要（デスクトップモード）。http://localhost:8080 を開くと左に **shop (postgres)** が事前登録されているので、
> 展開して初回だけ接続パスワード `app` を入れれば `shop` DB のテーブルが見える。
>
> `node --test` の DB 層テストは **稼働中の PostgreSQL（:5432）** に接続して実行する（未起動ならその3ファイルは自動スキップ）。
> 接続先は環境変数 `DATABASE_URL`（既定 `postgres://app:app@localhost:5432/shop`）。
>
> データは名前付きボリューム `pgdata` に保存され、`docker compose down` では消えない。作り直すときは `docker compose down -v`。

- 課税/非課税は `tax_category` で判定（税率では判定しない）
- 商品券・切符（乗車券）は非課税（EXEMPT）
- 仕様: [SPEC.md](./SPEC.md) ／ 手順: [LECTURE.md](./LECTURE.md) ／ 解説: [docs/01_environment.md](../../../docs/01_environment.md)
