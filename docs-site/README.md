# docs-site

自動テスト ハンズオンのドキュメントサイト（Astro + [Starlight](https://starlight.astro.build/) 製）。

リポジトリ直下の [`docs/`](../docs/00_overview.md) にある Markdown を取り込んで、Starlight のドキュメントテーマ（サイドバー・目次・全文検索・ダークモード・レスポンシブ）で表示します。**ドキュメントの実体は `docs/*.md` が正**で、このサイトはそれを見やすく配信するだけです。

## 仕組み

`scripts/sync-docs.mjs` が `../docs/*.md` を Starlight のコンテンツコレクション `src/content/docs/` に取り込みます。その際に:

- ファイル名先頭の数字をサイドバー表示順（`sidebar.order`）に
- 最初の `# 見出し` をページタイトル（frontmatter `title`）に。本文中の H1 は Starlight が描画するため除去
- 旧ナビ行（`ナビ: …`）と直後の区切り線は、サイドバーと重複するため除去
- 章間リンク `](01_environment.md)` をサイトのパス `](/01_environment)` に書き換え（先頭章 `00_overview` はトップページ `/` として出力）

を行います。`src/content/docs/` は生成物なので Git 管理対象外（`.gitignore` 済み）です。

## コマンド

```sh
npm install        # 初回のみ
npm run dev        # docs を同期して開発サーバ起動（http://localhost:4321）
npm run build      # docs を同期して静的ビルド（dist/）
npm run preview    # ビルド結果をプレビュー
npm run sync       # docs の同期だけ実行
```

## 構成

```
docs-site/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── scripts/
│   └── sync-docs.mjs        … ../docs/*.md を取り込む
└── src/
    └── content/
        ├── config.ts        … Starlight docs コレクション定義
        └── docs/            … 生成物（gitignore）
```

レイアウト・ルーティング・サイドバー・検索は Starlight が提供するため、独自の `layouts/` や `pages/` は持ちません。テーマ調整は [`astro.config.mjs`](astro.config.mjs) の `starlight({ … })` オプションで行います。
