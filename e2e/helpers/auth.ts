import { Page } from '@playwright/test';

/**
 * Mock login - bypasses API by setting localStorage directly
 * This ensures tests work regardless of backend state
 */
export async function login(page: Page, email = 'test@test.com', password = 'test123') {
    await page.goto('/login');

    // Mock the authentication by setting localStorage directly
    await page.evaluate(() => {
        const mockUser = {
            id: 1,
            email: 'test@test.com',
            role: { id: 2, name: 'nurse' }
        };

        const mockToken = 'mock-jwt-token-for-e2e-tests';

        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
    });

    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
}

/**
 * Logout helper
 */
export async function logout(page: Page) {
    // Look for logout button
    const logoutButton = page.locator('button:has-text("Cerrar Sesión"), button:has-text("Logout"), button:has-text("Salir")');

    if (await logoutButton.isVisible()) {
        await logoutButton.click();
        await page.waitForURL('**/login', { timeout: 5000 });
    } else {
        // Fallback: clear localStorage and navigate to login
        await page.evaluate(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        });
        await page.goto('/login');
    }
}

/**
 * Clear localStorage to reset mock data
 */
export async function clearMockData(page: Page) {
    await page.evaluate(() => {
        localStorage.clear();
    });
}

/**
 * Initialize mock data by reloading the page
 * This triggers the initializeStorage() function
 */
export async function initializeMockData(page: Page) {
    await clearMockData(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
}
