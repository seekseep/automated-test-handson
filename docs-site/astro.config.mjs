import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

// ドキュメントサイト設定。docs/*.md は scripts/sync-docs.mjs で
// src/content/docs/ に取り込んでから Starlight でビルドする。
export default defineConfig({
  server: { port: 4321 },
  integrations: [
    starlight({
      title: '自動テスト ハンズオン',
      defaultLocale: 'root',
      locales: {
        root: { label: '日本語', lang: 'ja' },
      },
      // サイドバーは各ページ frontmatter の sidebar.order 順で自動生成する。
    }),
  ],
})
