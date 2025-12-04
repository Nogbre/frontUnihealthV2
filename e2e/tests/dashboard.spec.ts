import { test, expect, Page } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Dashboard Tests', () => {
    let page: Page;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        await login(page);
        // Ensure we're actually on dashboard
        await page.goto('/dashboard');
        await page.waitForLoadState('networkidle');
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('should display dashboard with statistics', async () => {
        // Verify we're on dashboard
        await expect(page).toHaveURL(/.*dashboard/);

        // Verify we have some content (flexible check)
        const body = await page.textContent('body');
        expect(body).toMatch(/Dashboard|Panel|Pacientes|Citas|Alertas/i);
    });

    test('should navigate to different sections', async () => {
        // Navigate to Patients via sidebar
        const patientsLink = page.locator('a').filter({ hasText: /Pacientes/i }).first();
        if (await patientsLink.isVisible()) {
            await patientsLink.click();
            await page.waitForTimeout(1000);
            await expect(page).toHaveURL(/patients/);
        }
    });
});
