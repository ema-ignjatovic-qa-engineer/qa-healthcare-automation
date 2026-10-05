import { test, expect } from '@playwright/test';

test('should complete a successful card payment from POS', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.selectOption('#paymentMethod', 'card');

    await page.fill('#paymentAmount', '50');

    await page.selectOption('#paymentResult', 'approved');

    await page.click('#payButton');

    await expect(page.locator('#paymentStatus'))
        .toHaveText('Payment successful');
});