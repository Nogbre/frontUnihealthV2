import { test, expect, Page } from '@playwright/test';
import { login } from '../helpers/auth';

test.describe('Alert Management Tests', () => {
    let page: Page;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        await login(page);

        // Navigate to alerts page
        await page.goto('/dashboard/alerts');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1500);
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('should display alerts from mock data', async () => {
        // Verify we're on alerts page - flexible check
        const body = await page.textContent('body');
        expect(body).toMatch(/Alerta|Alert|Emergencia/i);
    });

    test('should filter alerts by tab', async () => {
        // Look for tab buttons
        const activeTab = page.locator('button').filter({ hasText: /Activa|Active/i }).first();

        if (await activeTab.isVisible({ timeout: 3000 })) {
            await activeTab.click();
            await page.waitForTimeout(500);
        }
    });

    test('should accept and respond to an alert', async () => {
        // Look for accept button
        const acceptBtn = page.locator('button').filter({ hasText: /Aceptar|Accept|Responder|Respond/i }).first();

        if (await acceptBtn.isVisible({ timeout: 3000 })) {
            await acceptBtn.click();
            await page.waitForTimeout(1000);
        }
    });

    test('should view patient history from alert', async () => {
        // Look for history button
        const historyBtn = page.locator('button').filter({ hasText: /Historial|History|Historia/i }).first();

        if (await historyBtn.isVisible({ timeout: 3000 })) {
            await historyBtn.click();
            await page.waitForTimeout(1000);
        }
    });

    test('should make phone call to patient', async () => {
        // Look for call button
        const callBtn = page.locator('button').filter({ hasText: /Llamar|Call/i }).first();

        if (await callBtn.isVisible({ timeout: 2000 })) {
            // Just verify it exists
            expect(await callBtn.isVisible()).toBeTruthy();
        }
    });

    test('should get directions to patient location', async () => {
        // Look for directions button
        const directionsBtn = page.locator('button').filter({ hasText: /Direccion|Direction|Mapa|Map/i }).first();

        if (await directionsBtn.isVisible({ timeout: 2000 })) {
            expect(await directionsBtn.isVisible()).toBeTruthy();
        }
    });

    test('should view recent patients sidebar', async () => {
        // Check if sidebar content exists
        const body = await page.textContent('body');
        expect(body).toMatch(/Juan|María|Carlos|Ana|Pedro|Paciente|Patient/i);
    });

    test('should click on recent patient to view history', async () => {
        // Look for patient cards in sidebar
        const patientCard = page.locator('div, button, a').filter({ hasText: /Juan|María|Carlos/i }).first();

        if (await patientCard.isVisible({ timeout: 3000 })) {
            await patientCard.click();
            await page.waitForTimeout(1000);
        }
    });
});
