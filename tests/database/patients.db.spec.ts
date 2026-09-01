import { test, expect } from '@playwright/test';
import { db } from './db';

test.describe('Patients Database Validation', () => {

    test('should verify patients table contains expected records', async () => {

        const result = await db.query(`
            SELECT *
            FROM patients
            ORDER BY id
        `);

        expect(result.rows.length).toBeGreaterThanOrEqual(3);

        expect(result.rows[0]).toMatchObject({
            id: 1,
            first_name: 'John',
            last_name: 'Smith',
            email: 'john.smith@example.com'
        });

        expect(result.rows[1]).toMatchObject({
            id: 2,
            first_name: 'Sarah',
            last_name: 'Johnson',
            email: 'sarah.johnson@example.com'
        });

        expect(result.rows[2]).toMatchObject({
            id: 3,
            first_name: 'Michael',
            last_name: 'Brown',
            email: 'michael.brown@example.com'
        });
    });

    test('should find patient by email', async () => {

        const email = 'john.smith@example.com';

        const result = await db.query(`
            SELECT *
            FROM patients
            WHERE email = $1
        `, [email]);

        expect(result.rows).toHaveLength(1);

        expect(result.rows[0]).toMatchObject({
            first_name: 'John',
            last_name: 'Smith',
            email: 'john.smith@example.com'
        });
    });

});