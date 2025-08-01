
import { test, expect } from '@playwright/test';

const baseURL = 'https://todomvc.com/examples/react/dist/';

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

test('Full TodoMVC test flow', async ({ page }) => {
  const today = formatDate(new Date());
  const tomorrow = formatDate(new Date(Date.now() + 86400000));

  await page.goto(baseURL);
  await page.screenshot({ path: 'screenshots/01-homepage.png' });
  await page.waitForTimeout(1000);

  expect(page.url()).toBe(baseURL);

  const input = page.locator('.new-todo');

  // Add TODO 1 (today)
  await input.fill(`TODO 1 - ${today}`);
  await input.press('Enter');
  await page.waitForTimeout(1000);
  const todo1 = page.locator('li').filter({ hasText: `TODO 1 - ${today}` });
  await expect(todo1).toBeVisible();
  await page.screenshot({ path: 'screenshots/02-TODO 1 added.png' });
  
  // Add TODO 2 (tomorrow)
  await input.fill(`TODO 2 - ${tomorrow}`);
  await input.press('Enter');
  await page.waitForTimeout(1000);
  const todo2 = page.locator('li').filter({ hasText: `TODO 2 - ${tomorrow}` });
  await expect(todo2).toBeVisible();

  await page.screenshot({ path: 'screenshots/03-TODO 2 added.png' });
  await page.waitForTimeout(1000);

  // Mark TODO 1 as completed
  await todo1.locator('.toggle').check();
  await expect(todo1).toHaveClass(/completed/);
  await page.screenshot({ path: 'screenshots/04-TODO 1 completed.png' });
  await page.waitForTimeout(1000);

  // Delete TODO 2
  await todo2.hover();
  await todo2.locator('.destroy').click();
  await expect(page.locator('li').filter({ hasText: `TODO 2 - ${tomorrow}` })).toHaveCount(0);
  await page.waitForTimeout(1000);

  // Confirm TODO 1 still visible and completed
  await expect(todo1).toBeVisible();
  await expect(todo1).toHaveClass(/completed/);
  await page.screenshot({ path: 'screenshots/05-TODO 2 deleted.png' });
  await page.waitForTimeout(1000);
});
