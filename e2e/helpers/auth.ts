import { Page } from '@playwright/test';

export const TEST_USER = {
    email: 'test@example.com',
    password: '123456',
};

export async function login(page: Page, email: string = TEST_USER.email, password: string = TEST_USER.password) {
    await page.goto('/login');

    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);

    await page.click('button[type="submit"]');

    // Wait for navigation to home (/) after successful login
    await page.waitForURL('/', { timeout: 10000 });
}

export async function logout(page: Page) {
    // Close any open modals by clicking the modal Cancel button (last one)
    const modalCancelButton = page.locator('button:has-text("Cancelar")').last();
    try {
        await modalCancelButton.click({ timeout: 500 });
        await page.waitForTimeout(300); // Wait for modal close animation
    } catch {
        // No modal open, continue
    }

    // Click logout button
    await page.click('button:has-text("Cerrar Sesión"), button:has-text("Logout")');

    // Wait for redirect to login
    await page.waitForURL('/login', { timeout: 5000 });
}
