import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('landing page loads and shows hero', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText(/brew/i).first()).toBeVisible()
  })

  test('CTA link on landing goes to /app', async ({ page }) => {
    await page.goto('/')
    const cta = page.getByRole('link', { name: /start brewing/i }).first()
    await expect(cta).toHaveAttribute('href', '/app')
  })

  test('nav links are present', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /brew/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /blog/i }).first()).toBeVisible()
  })
})
