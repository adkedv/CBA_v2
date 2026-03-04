import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

const CONTENT_DIR = join(process.cwd(), 'content/blog')

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  slug?: string
  tags?: string[]
  published?: boolean
}

export interface PostMeta extends PostFrontmatter {
  slug: string
}

export interface Post extends PostMeta {
  contentHtml: string
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '')
}

export function getAllPostMeta(): PostMeta[] {
  if (!existsSync(CONTENT_DIR)) return []

  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const raw = readFileSync(join(CONTENT_DIR, filename), 'utf8')
      const { data } = matter(raw)
      const fm = data as PostFrontmatter
      return {
        ...fm,
        slug: fm.slug ?? slugFromFilename(filename),
      }
    })
    .filter((p) => p.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filepath = join(CONTENT_DIR, `${slug}.md`)
  if (!existsSync(filepath)) return null

  const raw = readFileSync(filepath, 'utf8')
  const { data, content } = matter(raw)
  const fm = data as PostFrontmatter

  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content)
  const contentHtml = processed.toString()

  return {
    ...fm,
    slug: fm.slug ?? slug,
    contentHtml,
  }
}

export function getAllSlugs(): string[] {
  if (!existsSync(CONTENT_DIR)) return []
  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(slugFromFilename)
}
