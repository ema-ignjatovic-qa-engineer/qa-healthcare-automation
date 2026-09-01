import { test, expect } from '@playwright/test';
import { db } from '../database/db';

const API_URL = 'http://localhost:3000';

test.describe('Patients API + Database Integration', () => {

    test('POST patient - should create patient in API and PostgreSQL', async ({ request }) => {

        const newPatient = {
            firstName: 'Integration',
            lastName: 'Test',
            dateOfBirth: '1990-06-15',
            email: `integration.${Date.now()}@example.com`,
            phone: '+381641234567'
        };

        // 1. Create patient through API
        const response = await request.post(`${API_URL}/api/patients`, {
            data: newPatient
        });

        expect(response.status()).toBe(201);

        const createdPatient = await response.json();

        expect(createdPatient).toMatchObject(newPatient);
        expect(createdPatient.id).toBeDefined();

        // 2. Verify patient directly in PostgreSQL
        const result = await db.query(`
            SELECT *
            FROM patients
            WHERE id = $1
        `, [createdPatient.id]);

        expect(result.rows).toHaveLength(1);

        expect(result.rows[0]).toMatchObject({
            id: createdPatient.id,
            first_name: newPatient.firstName,
            last_name: newPatient.lastName,
            email: newPatient.email,
            phone: newPatient.phone
        });

        // 3. Cleanup test data
        await db.query(`
            DELETE FROM patients
            WHERE id = $1
        `, [createdPatient.id]);
    });

});