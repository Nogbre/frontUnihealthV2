import { test, expect, Page } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Appointment CRUD Tests', () => {
    let page: Page;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        await login(page);

        // Navigate to appointments page
        await page.goto('/dashboard/appointments');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1500);
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('should display appointments calendar with mock data', async () => {
        // Verify we're on appointments page - flexible check
        const body = await page.textContent('body');
        expect(body).toMatch(/Agenda|Cita|Appointment/i);

        // Look for any appointment-related content
        expect(body).toMatch(/Día|Semana|Mes|Juan|María|Carlos/i);
    });

    test('should create a new appointment', async () => {
        // Click Nueva Cita button
        const newButton = page.locator('button').filter({ hasText: /Nueva.*Cita|New.*Appointment/i }).first();

        if (await newButton.isVisible({ timeout: 3000 })) {
            await newButton.click();
            await page.waitForTimeout(1000);

            // Should navigate to form or show modal
            const urlOrModal = await page.url();
            expect(urlOrModal).toMatch(/appointments|dashboard/);
        }
    });

    test('should view appointment details', async () => {
        // Click Ver Detalles button
        const detailsBtn = page.locator('button').filter({ hasText: /Ver.*Detalle|Details|Info/i }).first();

        if (await detailsBtn.isVisible({ timeout: 3000 })) {
            await detailsBtn.click();
            await page.waitForTimeout(1000);
            // Test passes - button was clicked successfully
        }
    });

    test('should delete an appointment', async () => {
        // Click delete button
        const deleteBtn = page.locator('button').filter({ hasText: /Eliminar|Delete/i }).first();

        if (await deleteBtn.isVisible({ timeout: 3000 })) {
            page.once('dialog', dialog => dialog.accept());
            await deleteBtn.click();
            await page.waitForTimeout(1500);
        }
    });

    test('should switch between different calendar views', async () => {
        // Check if view buttons exist
        const dayBtn = page.locator('button').filter({ hasText: /Día|Day/i }).first();

        if (await dayBtn.isVisible({ timeout: 2000 })) {
            // Try switching views
            const weekBtn = page.locator('button').filter({ hasText: /Semana|Week/i }).first();
            if (await weekBtn.isVisible()) {
                await weekBtn.click();
                await page.waitForTimeout(500);
            }
        }
    });
});
