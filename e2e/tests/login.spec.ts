import { test, expect, Page } from '@playwright/test';
import { logout } from '../helpers/auth';

test.describe('Login and Authentication Tests', () => {
    let page: Page;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('should display login page', async () => {
        await page.goto('/login');

        // Verify login form elements
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should be able to mock login and access dashboard', async () => {
        await page.goto('/login');

        // Mock authentication via localStorage
        await page.evaluate(() => {
            const mockUser = {
                id: 1,
                email: 'test@test.com',
                role: { id: 2, name: 'nurse' }
            };

            localStorage.setItem('token', 'mock-test-token');
            localStorage.setItem('user', JSON.stringify(mockUser));
        });

        // Navigate to dashboard
        await page.goto('/dashboard');

        // Verify we're on dashboard
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
        await expect(page.locator('h1:has-text("Dashboard"), h1:has-text("Panel Principal")')).toBeVisible();
    });

    test('should logout successfully', async () => {
        // Mock login first
        await page.goto('/login');
        await page.evaluate(() => {
            localStorage.setItem('token', 'mock-test-token');
            localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@test.com' }));
        });

        await page.goto('/dashboard');
        await expect(page).toHaveURL(/.*dashboard/);

        // Logout
        await logout(page);

        // Verify redirect to login
        await expect(page).toHaveURL(/.*login/);
    });

    test('should persist mock login after page refresh', async () => {
        // Mock login
        await page.goto('/login');
        await page.evaluate(() => {
            localStorage.setItem('token', 'mock-test-token');
            localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@test.com' }));
        });

        await page.goto('/dashboard');

        // Refresh page
        await page.reload();

        // Should still be on dashboard
        await expect(page).toHaveURL(/.*dashboard/);
    });

    test('should redirect to login when accessing protected route without auth', async () => {
        await page.goto('/dashboard/patients');

        // Should redirect to login
        await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    });
});
