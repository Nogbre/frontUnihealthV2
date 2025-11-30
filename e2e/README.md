# Playwright E2E Tests - UniHealth Frontend

## Overview

This directory contains end-to-end tests using Playwright for the UniHealth application. Each test covers a complete user journey from login to logout.

## Test Suites

### 1. Patient Creation (`patient.spec.ts`)
- Login with test credentials
- Navigate to Patients page
- Create a new patient with form data
- Verify patient appears in list
- Logout

### 2. Appointment Creation (`appointment.spec.ts`)
- Login with test credentials
- Navigate to Appointments page
- Create a new appointment (patient, nurse, service, date/time)
- Verify appointment appears in list
- Logout

### 3. Alert Creation (`alert.spec.ts`)
- Login with test credentials
- Navigate to Alerts page
- Create a new alert with description and location
- Verify alert appears in list
- Logout

## Prerequisites

Before running tests, ensure:

1. **Backend API** is running on `http://localhost:3000`
2. **Frontend dev server** is running on `http://localhost:5173`
3. **Test user exists** in database:
   - Email: `test@example.com`
   - Password: `123456`
4. **Database has sample data** (patients, nurses, service types, alert types)

## Running Tests

### Run all tests (headless)
```bash
npm run test:e2e
```

### Run tests with UI (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Run specific test file
```bash
npx playwright test e2e/tests/patient.spec.ts
```

## Test Results

After running tests:
- **HTML Report**: `playwright-report/index.html`
- **Screenshots**: Captured on test failures
- **Videos**: Recorded for failed tests
- **Traces**: Available for failed tests (first retry)

To view the HTML report:
```bash
npx playwright show-report
```

## Test Structure

```
e2e/
├── helpers/
│   └── auth.ts          # Login/logout helper functions
└── tests/
    ├── patient.spec.ts      # Patient creation E2E test
    ├── appointment.spec.ts  # Appointment creation E2E test
    └── alert.spec.ts        # Alert creation E2E test
```

## Troubleshooting

### Tests fail with "Timeout"
- Ensure backend API is running
- Ensure frontend dev server is running
- Check network connectivity

### Tests fail with "Element not found"
- UI selectors may have changed
- Check that the test user has proper permissions
- Verify database has required reference data

### Login fails
- Verify test user exists in database
- Check credentials in `e2e/helpers/auth.ts`
- Ensure backend authentication is working

## Configuration

Playwright configuration is in `playwright.config.ts`:
- Base URL: `http://localhost:5173`
- Browser: Chromium
- Retries: 0 locally, 2 in CI
- Video/Screenshots: On failure only
