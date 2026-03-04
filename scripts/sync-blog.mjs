#!/usr/bin/env node
/**
 * Sync blog posts from Obsidian vault to content/blog/
 *
 * Usage:
 *   node scripts/sync-blog.mjs [--vault <path>] [--dry-run]
 *
 * The source vault path defaults to OBSIDIAN_VAULT env var, or
 * D:/claude_the_lord/Claude-Vault/blog (project default).
 *
 * Only .md files with `published: true` in frontmatter are copied.
 * Images referenced in posts are NOT copied (use absolute URLs or a CDN).
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join, basename } from 'path'
import matter from 'gray-matter'

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const vaultFlag = args.indexOf('--vault')
const VAULT_PATH =
  vaultFlag !== -1
    ? args[vaultFlag + 1]
    : process.env['OBSIDIAN_VAULT'] ?? 'D:/claude_the_lord/Claude-Vault/blog'
const OUT_DIR = 'content/blog'

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  )
}

function slugify(filename) {
  return basename(filename, '.md')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

let synced = 0
let skipped = 0

try {
  statSync(VAULT_PATH)
} catch {
  console.error(`Vault not found: ${VAULT_PATH}`)
  console.error('Set OBSIDIAN_VAULT env var or pass --vault <path>')
  process.exit(1)
}

if (!DRY_RUN) mkdirSync(OUT_DIR, { recursive: true })

const files = walk(VAULT_PATH).filter((f) => f.endsWith('.md'))
console.log(`Found ${files.length} markdown files in vault`)

for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  const { data: fm } = matter(raw)

  if (!fm['published']) {
    skipped++
    continue
  }

  const slug = fm['slug'] ?? slugify(file)
  const dest = join(OUT_DIR, `${slug}.md`)

  if (DRY_RUN) {
    console.log(`[dry-run] would write → ${dest}`)
  } else {
    writeFileSync(dest, raw, 'utf8')
    console.log(`\u2713 ${dest}`)
  }
  synced++
}

console.log(`\nDone. ${synced} posts synced, ${skipped} skipped (not published).`)
