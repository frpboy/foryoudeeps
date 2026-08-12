import { expect, test } from '@playwright/test';

const birthdayNow = new Date('2026-08-15T00:01:00+05:30').valueOf();
const preBirthdayNow = new Date('2026-08-14T23:59:00+05:30').valueOf();
const targetViewports = [
  { width: 320, height: 700 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

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

test('renders the birthday journey with the approved gallery memories', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('LEVEL 31 UNLOCKED')).toBeVisible();
  await expect(page.getByText('A few memories, held close')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open gallery item 1' })).toBeVisible();
  await expect(page.getByText('Words worth waiting for')).toBeVisible();
    await expect(page.getByRole('button', { name: /start again/i })).toBeVisible();
});

test('opens, navigates, and closes the gallery lightbox accessibly', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open gallery item 1' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByText('2 / 2')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('keeps the pre-birthday experience a secret waiting room', async ({ page }) => {
  await page.addInitScript((timestamp) => {
    class PreBirthdayDate extends Date {
      constructor(...args: ConstructorParameters<typeof Date>) {
        super(...(args.length ? args : [timestamp] as ConstructorParameters<typeof Date>));
      }
      static now() { return timestamp; }
    }
    // @ts-expect-error test-only clock replacement
    window.Date = PreBirthdayDate;
  }, preBirthdayNow);

  await page.goto('/');
  await expect(page.getByText('something is waiting for you...')).toBeVisible();
  await expect(page.getByText('LEVEL 31 UNLOCKED')).not.toBeVisible();
  await expect(page.getByText('one more message...')).not.toBeVisible();
});

test('opens the birthday journey through the explicit preview URL before the date', async ({ page }) => {
  await page.goto('/?preview=birthday');
  await expect(page.getByText('Birthday preview')).toBeVisible();
  await expect(page.getByText('LEVEL 31 UNLOCKED')).toBeVisible();
});

test('accepts the short preview-birthday URL before the date', async ({ page }) => {
  await page.goto('/?preview-birthday');
  await expect(page.getByText('Birthday preview')).toBeVisible();
  await expect(page.getByText('LEVEL 31 UNLOCKED')).toBeVisible();
});

test('keeps the responsive birthday journey free of horizontal overflow and console errors', async ({ page }) => {
  const errors: string[] = [];
  const failedResponses: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      const location = message.location();
      errors.push(`${message.text()} ${location.url || location.lineNumber || 'unknown-source'}`);
    }
  });
  page.on('response', (response) => {
    if (response.status() >= 400) failedResponses.push(`${response.status()} ${new URL(response.url()).pathname}`);
  });

  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await expect(page.getByText('LEVEL 31 UNLOCKED')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  await page.locator('#final').scrollIntoViewIfNeeded();
    const replay = page.getByRole('button', { name: /start again/i });
  await expect(replay).toBeVisible();
  await replay.click();
  await expect(page.getByRole('heading', { name: 'Deeps' })).toBeVisible();
  expect(failedResponses).toEqual([]);
  expect(errors).toEqual([]);
});

test('keeps every supported mobile, tablet, and desktop width free of horizontal overflow', async ({ page }) => {
  for (const viewport of targetViewports) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.locator('#reveal')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
      `${viewport.width}px should not introduce horizontal page scrolling`,
    ).toBe(true);
  }
});
