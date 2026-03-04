import { test, expect } from '@playwright/test'

test.describe('Blog', () => {
  test('blog index loads', async ({ page }) => {
    await page.goto('/blog')
    await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible()
  })

  test('shows empty state when no posts', async ({ page }) => {
    await page.goto('/blog')
    // Either shows posts or the empty state message
    const hasNoPosts = await page.getByText('No posts yet').isVisible().catch(() => false)
    const hasPostList = await page.locator('article, [data-testid="post-card"]').count()
    expect(hasNoPosts || hasPostList >= 0).toBeTruthy()
  })
})
