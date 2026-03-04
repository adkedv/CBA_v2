import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPostMeta } from '@/lib/blog/reader'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Blog | Coffee Brewing Assistant',
  description: 'Guides, tips, and deep dives on coffee brewing technique.',
}

export default function BlogPage() {
  const posts = getAllPostMeta()

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold text-brand-espresso">Blog</h1>
        <p className="text-brand-brown/70 mt-2">Guides, tips, and coffee deep dives.</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-brand-brown/50">No posts yet. Check back soon.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <Card>
                <div className="text-xs text-brand-brown/40 mb-2">
                  {new Date(post.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <h2 className="font-serif text-xl font-bold text-brand-espresso group-hover:text-brand-brown transition-colors">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-brand-brown/70 mt-2 text-sm leading-relaxed">
                    {post.description}
                  </p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
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
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
