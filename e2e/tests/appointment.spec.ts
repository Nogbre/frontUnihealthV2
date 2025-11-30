import { test, expect } from '@playwright/test';
import { login, logout } from '../helpers/auth';

test.describe('Appointment Creation Flow', () => {
    test('should create a new appointment from login to logout', async ({ page }) => {
        // Step 1: Login
        await login(page);

        // Step 2: Navigate to Appointments page
        await page.click('a:has-text("Citas"), a:has-text("Appointments")');
        await page.waitForURL('**/appointments');

        // Step 3: Click Add Appointment button
        await page.click('button:has-text("Nueva Cita")');

        // Wait for modal to appear
        await page.waitForSelector('text=Nueva Cita');

        // Step 4: Fill appointment form
        const timestamp = Date.now();

        // Get current date and time for appointment (tomorrow at 10:00)
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);

        const endTime = new Date(tomorrow);
        endTime.setHours(11, 0, 0, 0);

        const startFormatted = tomorrow.toISOString().slice(0, 16); // Format: 2024-11-25T10:00
        const endFormatted = endTime.toISOString().slice(0, 16);     // Format: 2024-11-25T11:00

        // Select patient - first combobox
        await page.getByRole('combobox').first().selectOption({ index: 1 });

        // Select nurse - second combobox
        await page.getByRole('combobox').nth(1).selectOption({ index: 1 });

        // Fill service type ID (number input)
        await page.locator('input[type="number"]').fill('1');

        // Fill start datetime
        await page.locator('input[type="datetime-local"]').first().fill(startFormatted);

        // Fill end datetime
        await page.locator('input[type="datetime-local"]').nth(1).fill(endFormatted);

        // Fill reason using textarea selector
        await page.locator('textarea').fill(`Test appointment ${timestamp}`);

        // Step 5: Submit form
        await page.click('button[type="submit"]:has-text("Crear Cita")');

        // Step 6: Verify appointment appears in list
        await page.waitForTimeout(2000); // Wait for API response

        // Verify appointment appears in the list (by reason)
        await expect(page.locator(`text=Test appointment ${timestamp}`)).toBeVisible({ timeout: 5000 });

        // Step 7: Logout
        await logout(page);

        // Verify we're on login page
        await expect(page).toHaveURL('/login');
    });
});
