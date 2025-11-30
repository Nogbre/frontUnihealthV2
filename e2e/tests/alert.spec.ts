import { test, expect } from '@playwright/test';
import { login, logout } from '../helpers/auth';

test.describe('Alert Creation Flow', () => {
    test('should create a new alert from login to logout', async ({ page }) => {
        // Step 1: Login
        await login(page);

        // Step 2: Navigate to Alerts page
        await page.click('a:has-text("Alertas"), a:has-text("Alerts")');
        await page.waitForURL('**/alerts');

        // Step 3: Click Create Alert button
        await page.click('button:has-text("Nueva Alerta")');

        // Wait for modal to appear
        await page.waitForSelector('text=Nueva Alerta');

        // Step 4: Fill alert form
        const timestamp = Date.now();
        const testAlert = {
            description: `Test alert E2E ${timestamp}`,
            latitude: '4.6097',
            longitude: '-74.0817',
            typeId: '1',
        };

        // Select patient - first combobox
        const patientSelect = page.getByRole('combobox').first();
        await patientSelect.selectOption({ index: 1 });

        // Fill alert type ID (number input)
        await page.locator('input[type="number"]').first().fill(testAlert.typeId);

        // Fill latitude
        await page.locator('input[placeholder="40.4168"]').fill(testAlert.latitude);

        // Fill longitude
        await page.locator('input[placeholder="-3.7038"]').fill(testAlert.longitude);

        // Fill description using textarea
        await page.locator('textarea').fill(testAlert.description);

        // Step 5: Submit form
        await page.click('button[type="submit"]:has-text("Crear Alerta")');

        // Step 6: Verify alert appears inlist
        await page.waitForTimeout(2000); // Wait for API response

        // Verify alert appears in the list (search for unique part of description)
        await expect(page.locator(`text=Test alert E2E ${timestamp}`).first()).toBeVisible({ timeout: 5000 });

        // Step 7: Logout
        await logout(page);

        // Verify we're on login page
        await expect(page).toHaveURL('/login');
    });
});
