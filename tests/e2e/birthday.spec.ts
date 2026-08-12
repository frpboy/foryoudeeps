import { expect, test } from '@playwright/test';

const birthdayNow = new Date('2026-08-15T00:01:00+05:30').valueOf();

test.beforeEach(async ({ page }) => {
  await page.addInitScript((timestamp) => {
    class BirthdayDate extends Date {
      constructor(...args: ConstructorParameters<typeof Date>) {
        super(...(args.length ? args : [timestamp] as ConstructorParameters<typeof Date>));
      }
      static now() { return timestamp; }
    }
    // @ts-expect-error test-only clock replacement
    window.Date = BirthdayDate;
  }, birthdayNow);
});

test('renders the birthday journey with intentional empty media states', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('LEVEL 31 UNLOCKED')).toBeVisible();
  await expect(page.getByText('A few memories, held close')).toBeVisible();
  await expect(page.getByText('The album is ready')).toBeVisible();
  await expect(page.getByText('Words worth waiting for')).toBeVisible();
  await expect(page.getByRole('button', { name: /replay the experience/i })).toBeVisible();
});

test('keeps the responsive birthday journey free of horizontal overflow and console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await expect(page.getByText('LEVEL 31 UNLOCKED')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await page.locator('#final').scrollIntoViewIfNeeded();
  const replay = page.getByRole('button', { name: /replay the experience/i });
  await expect(replay).toBeVisible();
  await replay.click();
  await expect(page.getByRole('heading', { name: 'Deeps' })).toBeVisible();
  expect(errors).toEqual([]);
});
