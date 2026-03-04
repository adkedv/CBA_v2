import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getAllSlugs } from '@/lib/blog/reader'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: `${post.title} | Coffee Brewing Assistant`,
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  // contentHtml is produced server-side by remark from our own static markdown
  // files (content/blog/*.md), which are written only by scripts/sync-blog.mjs
  // from the owner's Obsidian vault. This is NOT user-submitted content.
  /* eslint-disable-next-line @next/next/no-html-link-for-pages */
  const html = post.contentHtml

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link
        href="/blog"
        className="text-sm text-brand-brown/50 hover:text-brand-brown transition-colors mb-8 inline-block"
      >
        &larr; All posts
      </Link>

      <article>
        <header className="mb-10">
          <div className="text-xs text-brand-brown/40 mb-3">
            {new Date(post.date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
          <h1 className="font-serif text-4xl font-bold text-brand-espresso leading-tight">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-brand-brown/70 mt-3 text-lg">{post.description}</p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-brand-tan/30 text-brand-brown/60 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Safe: server-rendered from owner-controlled static markdown files only */}
        <div
          className="prose prose-stone max-w-none
            prose-headings:font-serif prose-headings:text-brand-espresso
            prose-p:text-brand-brown/80 prose-p:leading-relaxed
            prose-a:text-brand-brown prose-a:underline
            prose-strong:text-brand-espresso
            prose-code:text-brand-espresso prose-code:bg-brand-tan/20 prose-code:px-1 prose-code:rounded
            prose-blockquote:border-brand-brown/30 prose-blockquote:text-brand-brown/60"
          // nosemgrep: react-dangerouslysetinnerhtml
          dangerouslySetInnerHTML={{ __html: html }} // trusted: owner-controlled static files
        />
      </article>
    </div>
  )
}
