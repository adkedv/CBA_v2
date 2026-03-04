import { test, expect } from '@playwright/test'

test.describe('Brew App', () => {
  test('loads and shows Hot V60 by default', async ({ page }) => {
    await page.goto('/app')
    await expect(page.getByText('Hot V60')).toBeVisible()
  })

  test('tab switcher shows all 6 methods', async ({ page }) => {
    await page.goto('/app')
    for (const label of ['Hot V60', 'Iced V60', 'AeroPress', 'French Press', 'Moka Pot', 'Cold Brew']) {
      await expect(page.getByRole('button', { name: label })).toBeVisible()
    }
  })

  test('switching to AeroPress shows AeroPress guide', async ({ page }) => {
    await page.goto('/app')
    await page.getByRole('button', { name: 'AeroPress' }).click()
    await expect(page.getByText('AeroPress Guide')).toBeVisible()
  })

  test('switching to Cold Brew shows Cold Brew guide', async ({ page }) => {
    await page.goto('/app')
    await page.getByRole('button', { name: 'Cold Brew' }).click()
    await expect(page.getByText('Cold Brew Guide')).toBeVisible()
  })

  test('Hot V60 setup shows recipe selector', async ({ page }) => {
    await page.goto('/app')
    await expect(page.getByText('4:6 Method')).toBeVisible()
    await expect(page.getByText('Single Pour Method')).toBeVisible()
  })

  test('Hot V60 Start Brewing button enabled after checklist', async ({ page }) => {
    await page.goto('/app')
    const startBtn = page.getByRole('button', { name: 'Start Brewing' })
    await expect(startBtn).toBeDisabled()

    // Check all items
    const checkboxes = page.getByRole('button').filter({ hasText: /grind|heat|tare|rinse|assemble/i })
    const count = await checkboxes.count()
    for (let i = 0; i < count; i++) {
      await checkboxes.nth(i).click()
    }
    await expect(startBtn).toBeEnabled()
  })
})
