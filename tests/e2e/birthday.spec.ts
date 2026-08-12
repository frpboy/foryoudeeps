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

test('keeps the countdown age artwork contained across target viewport widths', async ({ page }) => {
  for (const width of [320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.countdown-age--past')).toBeVisible();
    await expect(page.locator('.countdown-age--arriving')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test('stops ambient movement for reduced-motion users', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/birthday?preview=birthday');
  await expect(page.locator('.ambient-particles--still')).toBeVisible();
  await expect(page.locator('.ambient-particle').first()).toHaveCSS('animation-name', 'none');
});

test('keeps every routed scene inside the visual viewport', async ({ page }) => {
  const viewports = [
    [320, 568], [360, 640], [375, 667], [390, 844], [414, 896], [430, 932],
    [768, 1024], [1024, 768], [1280, 720], [1366, 768], [1440, 900], [1920, 1080],
  ] as const;
  const routes = ['/', '/birthday?preview=birthday', '/memories?preview=birthday', '/gallery?preview=birthday', '/gallery/gallery-001?preview=birthday', '/wishes?preview=birthday', '/wishes/missing?preview=birthday', '/daughter?preview=birthday', '/final?preview=birthday'];
  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    for (const route of routes) {
      await page.goto(route);
      const dimensions = await page.evaluate(() => ({
        height: document.documentElement.scrollHeight,
        width: document.documentElement.scrollWidth,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
        scrollY: window.scrollY,
      }));
      expect(dimensions.height, `${route} at ${width}x${height}: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(dimensions.viewportHeight + 1);
      expect(dimensions.width, `${route} at ${width}x${height}`).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
      expect(dimensions.scrollY, `${route} at ${width}x${height}`).toBe(0);
    }
  }
});
