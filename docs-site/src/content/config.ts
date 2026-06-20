import { defineCollection } from 'astro:content'
import { docsSchema } from '@astrojs/starlight/schema'

// Starlight のドキュメントコレクション。実体は scripts/sync-docs.mjs が
// ../docs/*.md を取り込んで src/content/docs/ に生成する。
export const collections = {
  docs: defineCollection({ schema: docsSchema() }),
}
