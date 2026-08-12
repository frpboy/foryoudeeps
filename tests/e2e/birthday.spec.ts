import { expect, test } from '@playwright/test';

test('guards normal pre-birthday routes and preserves preview routing', async ({ page }) => {
  await page.goto('/gallery');
  await expect(page.locator('#countdown')).toBeVisible();
  await page.goto('/?preview=birthday');
  await expect(page.getByText('Birthday preview')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue to memories' })).toBeVisible();
});

test('uses client-side gallery detail routes with history navigation', async ({ page }) => {
  let loads = 0;
  page.on('load', () => { loads += 1; });
  await page.goto('/gallery?preview=birthday');
  await page.getByRole('button', { name: 'Open gallery item 1' }).click();
  await expect(page).toHaveURL(/\/gallery\/gallery-001\?preview=birthday$/);
  await expect(page.getByRole('link', { name: /back to memories/i })).toBeVisible();
  await page.getByRole('button', { name: /next/i }).click();
  await expect(page).toHaveURL(/\/gallery\/gallery-002\?preview=birthday$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/gallery\/gallery-001\?preview=birthday$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/gallery\?preview=birthday$/);
  expect(loads).toBe(1);
});

test('supports direct routed-page loading without browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  await page.goto('/gallery/gallery-001?preview=birthday');
  await expect(page.getByRole('link', { name: /back to memories/i })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('link', { name: /back to memories/i })).toBeVisible();
  expect(errors).toEqual([]);
});

test('moves through the major story pages with edge taps and keyboard navigation', async ({ page }) => {
  await page.goto('/birthday?preview=birthday');
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/\/memories\?preview=birthday$/);
  const viewport = page.viewportSize()!;
  await page.mouse.click(1, 200);
  await expect(page).toHaveURL(/\/birthday\?preview=birthday$/);
  await page.mouse.click(viewport.width - 1, 200);
  await expect(page).toHaveURL(/\/memories\?preview=birthday$/);
  await page.mouse.click(viewport.width - 1, 200);
  await expect(page).toHaveURL(/\/gallery\?preview=birthday$/);
});
