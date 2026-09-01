import { test, expect } from '@playwright/test';
import { deletePatientByEmail } from '../helpers/test-data';

test.describe('Patient Portal UI', () => {

    test('should display the patient list', async ({ page }) => {

        await page.goto('/');

        await expect(
            page.getByRole('heading', {
                name: 'Healthcare Patient Portal'
            })
        ).toBeVisible();

        await expect(
            page.getByRole('heading', {
                name: 'John Smith'
            })
        ).toBeVisible();

        await expect(
            page.getByRole('heading', {
                name: 'Sarah Johnson'
            })
        ).toBeVisible();

        await expect(
            page.getByRole('heading', {
                name: 'Michael Brown'
            })
        ).toBeVisible();
    });


    test('should open the Add Patient form', async ({ page }) => {

        await page.goto('/');

        await page.getByRole('button', {
            name: 'Add Patient'
        }).click();

        await expect(
            page.getByRole('heading', {
                name: 'Add New Patient'
            })
        ).toBeVisible();

        await expect(
            page.getByLabel('First Name')
        ).toBeVisible();

        await expect(
            page.getByLabel('Last Name')
        ).toBeVisible();

        await expect(
            page.getByLabel('Date of Birth')
        ).toBeVisible();

        await expect(
            page.getByLabel('Email')
        ).toBeVisible();

        await expect(
            page.getByLabel('Phone')
        ).toBeVisible();
    });


    test('should create a new patient through the UI', async ({ page }) => {

        const uniqueEmail = `ui.test.${Date.now()}@example.com`;
        const uniqueFirstName = `UI-${Date.now()}`;

        await page.goto('/');

        await page.getByRole('button', {
            name: 'Add Patient'
        }).click();

        await page.getByLabel('First Name').fill(uniqueFirstName);

        await page.getByLabel('Last Name').fill('Test Patient');

        await page.getByLabel('Date of Birth').fill('1995-03-20');

        await page.getByLabel('Email').fill(uniqueEmail);

        await page.getByLabel('Phone').fill('+381641234567');

        await page.getByRole('button', {
            name: 'Save Patient'
        }).click();

        await expect(
            page.getByText('Patient created successfully.')
        ).toBeVisible();

        await expect(
            page.getByRole('heading', {
                name: `${uniqueFirstName} Test Patient`
            })
        ).toBeVisible();

        await expect(
            page.getByText(uniqueEmail)
        ).toBeVisible();

        // Cleanup test data
        await deletePatientByEmail(uniqueEmail);
    });

});