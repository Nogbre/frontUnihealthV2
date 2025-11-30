import { test, expect } from '@playwright/test';
import { login, logout } from '../helpers/auth';

test.describe('Patient Creation Flow', () => {
    test('should create a new patient from login to logout', async ({ page }) => {
        // Step 1: Login
        await login(page);

        // Step 2: Navigate to Patients page
        await page.click('a:has-text("Pacientes"), a:has-text("Patients")');
        await page.waitForURL('**/patients');

        // Step 3: Click Add Patient button
        await page.click('button:has-text("Nuevo Paciente")');

        // Wait for modal to appear
        await page.waitForSelector('text=Nuevo Paciente');

        // Step 4: Fill patient form
        const timestamp = Date.now();
        const testPatient = {
            firstName: `Test`,
            lastName: `Patient${timestamp}`,
            email: `patient${timestamp}@test.com`,
            dob: '1990-01-15',
            phone: '+57 300 123 4567',
        };

        // Fill form fields using nth() for all inputs
        await page.locator('input[type="text"]').nth(0).fill(testPatient.firstName); // Nombre
        await page.locator('input[type="text"]').nth(1).fill(testPatient.lastName); // Apellido
        await page.locator('input[type="email"]').fill(testPatient.email); // Email
        await page.locator('input[type="tel"]').fill(testPatient.phone); // Teléfono
        await page.locator('input[type="date"]').fill(testPatient.dob); // DOB

        // Select gender
        await page.getByRole('combobox').selectOption('M');

        // Step 5: Submit form
        await page.click('button[type="submit"]:has-text("Crear")');

        // Step 6: Verify patient appears in list
        await page.waitForTimeout(2000); // Wait for API response

        // Verify patient appears in the table
        await expect(page.locator(`text=${testPatient.email}`)).toBeVisible({ timeout: 5000 });

        // Step 7: Logout
        await logout(page);

        // Verify we're on login page
        await expect(page).toHaveURL('/login');
    });
});
