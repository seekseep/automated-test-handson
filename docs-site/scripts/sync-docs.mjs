// リポジトリ直下の docs/*.md を Starlight のコンテンツコレクション
// (src/content/docs/) に取り込むスクリプト。
//   - ファイル名先頭の数字を sidebar.order に
//   - 最初の `# 見出し` を title に（本文からは除去。Starlight が見出しを描画する）
//   - 旧ナビ行（`ナビ: …`）は Starlight のサイドバーと重複するため除去
//   - 章間リンク `](00_overview.md)` をサイトのパス（`/` や `/01_environment`）に書き換え
//   - 先頭章（00_overview）はトップページ（index.md）として出力する
import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises'

const SRC_DIR = new URL('../../docs/', import.meta.url)
const OUT_DIR = new URL('../src/content/docs/', import.meta.url)

// トップページとして扱う章（slug を index にする）
const HOME_SLUG = '00_overview'

function deriveTitle(markdown, fallback) {
  const m = markdown.match(/^#\s+(.+?)\s*$/m)
  return m ? m[1] : fallback
}

function deriveOrder(filename) {
  const m = filename.match(/^(\d+)/)
  return m ? Number(m[1]) : 999
}

// 先頭の H1 見出しと、それに続く旧ナビ行を取り除く。
// （H1 は title として frontmatter に移し、ナビはサイドバーが担う）
function stripHeaderChrome(markdown) {
  return markdown
    .replace(/^#\s+.+?\r?\n/, '')
    .replace(/^\s*ナビ:.*(?:\r?\n)?/m, '')
    .replace(/^\s+/, '')
    // ナビ行の下にあった区切り線（先頭の水平線）も除去する
    .replace(/^(?:-{3,}|\*{3,})\s*(?:\r?\n)+/, '')
}

// 章リンクをサイトのパスに書き換える。
//   00_overview.md   -> /        （トップページ）
//   0X_name.md       -> /0X_name
function rewriteLinks(markdown) {
  return markdown.replace(/\]\((\d{2}_[a-z0-9-]+)\.md\)/g, (_m, slug) =>
    slug === HOME_SLUG ? '](/)' : `](/${slug})`,
  )
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true })
  await mkdir(OUT_DIR, { recursive: true })

  const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith('.md'))
  for (const file of files) {
    const raw = await readFile(new URL(file, SRC_DIR), 'utf8')
    const srcSlug = file.replace(/\.md$/, '')
    const isHome = srcSlug === HOME_SLUG
    const outFile = isHome ? 'index.md' : file
    const title = deriveTitle(raw, srcSlug)
    const order = deriveOrder(file)
    const body = rewriteLinks(stripHeaderChrome(raw))

    const frontmatter = [
      '---',
      `title: ${JSON.stringify(title)}`,
      'sidebar:',
      `  order: ${order}`,
      '---',
      '',
    ].join('\n')

    await writeFile(new URL(outFile, OUT_DIR), frontmatter + body, 'utf8')
    console.log(`synced: ${file} -> ${outFile} (order ${order})`)
  }
  console.log(`done: ${files.length} files`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
