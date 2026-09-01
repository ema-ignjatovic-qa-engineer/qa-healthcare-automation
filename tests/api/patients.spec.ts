import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';

test.describe('Patients API - CRUD', () => {

    test('GET /api/patients - should return all patients', async ({ request }) => {
        const response = await request.get(`${API_URL}/api/patients`);

        expect(response.status()).toBe(200);

        const patients = await response.json();

        expect(Array.isArray(patients)).toBe(true);
        expect(patients.length).toBeGreaterThanOrEqual(3);

        expect(patients[0]).toMatchObject({
            id: 1,
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@example.com'
        });
    });

    test('GET /api/patients/:id - should return patient by ID', async ({ request }) => {
        const response = await request.get(`${API_URL}/api/patients/1`);

        expect(response.status()).toBe(200);

        const patient = await response.json();

        expect(patient).toMatchObject({
            id: 1,
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@example.com'
        });
    });

    test('GET /api/patients/:id - should return 404 for non-existing patient', async ({ request }) => {
        const response = await request.get(`${API_URL}/api/patients/999`);

        expect(response.status()).toBe(404);

        const body = await response.json();

        expect(body).toEqual({
            error: 'Patient not found'
        });
    });

    test('POST /api/patients - should create a new patient', async ({ request }) => {
        const newPatient = {
            firstName: 'Test',
            lastName: 'Patient',
            dateOfBirth: '1990-06-15',
            email: `test.patient.${Date.now()}@example.com`,
            phone: '+1-555-0104'
        };

        const response = await request.post(`${API_URL}/api/patients`, {
            data: newPatient
        });

        expect(response.status()).toBe(201);

        const createdPatient = await response.json();

        expect(createdPatient).toMatchObject(newPatient);
        expect(createdPatient.id).toBeDefined();
    });

    test('POST /api/patients - should return 400 when required fields are missing', async ({ request }) => {
        const invalidPatient = {
            firstName: 'Test',
            lastName: 'Patient'
        };

        const response = await request.post(`${API_URL}/api/patients`, {
            data: invalidPatient
        });

        expect(response.status()).toBe(400);

        const body = await response.json();

        expect(body.error).toContain('required');
    });

    test('PUT /api/patients/:id - should update a patient created by the test', async ({ request }) => {

        // Create test data
        const newPatient = {
            firstName: 'Update',
            lastName: 'Test',
            dateOfBirth: '1991-01-01',
            email: `update.test.${Date.now()}@example.com`,
            phone: '+1-555-0110'
        };

        const createResponse = await request.post(`${API_URL}/api/patients`, {
            data: newPatient
        });

        expect(createResponse.status()).toBe(201);

        const createdPatient = await createResponse.json();

        // Update test data
        const updatedPatient = {
            firstName: 'Updated',
            lastName: 'Patient',
            dateOfBirth: '1991-01-01',
            email: `updated.patient.${Date.now()}@example.com`,
            phone: '+1-555-0199'
        };

        const updateResponse = await request.put(
            `${API_URL}/api/patients/${createdPatient.id}`,
            {
                data: updatedPatient
            }
        );

        expect(updateResponse.status()).toBe(200);

        const patient = await updateResponse.json();

        expect(patient).toMatchObject(updatedPatient);
        expect(patient.id).toBe(createdPatient.id);
    });

    test('PUT /api/patients/:id - should return 404 for non-existing patient', async ({ request }) => {
        const updatedPatient = {
            firstName: 'Test',
            lastName: 'Patient',
            dateOfBirth: '1995-01-01',
            email: 'test.patient@example.com'
        };

        const response = await request.put(`${API_URL}/api/patients/999`, {
            data: updatedPatient
        });

        expect(response.status()).toBe(404);

        const body = await response.json();

        expect(body).toEqual({
            error: 'Patient not found'
        });
    });

    test('DELETE /api/patients/:id - should delete a patient created by the test', async ({ request }) => {

        // Create test data
        const newPatient = {
            firstName: 'Delete',
            lastName: 'Test',
            dateOfBirth: '1992-02-02',
            email: `delete.test.${Date.now()}@example.com`,
            phone: '+1-555-0120'
        };

        const createResponse = await request.post(`${API_URL}/api/patients`, {
            data: newPatient
        });

        expect(createResponse.status()).toBe(201);

        const createdPatient = await createResponse.json();

        // Delete the created patient
        const deleteResponse = await request.delete(
            `${API_URL}/api/patients/${createdPatient.id}`
        );

        expect(deleteResponse.status()).toBe(200);

        const body = await deleteResponse.json();

        expect(body.message).toBe('Patient deleted successfully');
        expect(body.patient.id).toBe(createdPatient.id);

        // Verify deletion
        const getResponse = await request.get(
            `${API_URL}/api/patients/${createdPatient.id}`
        );

        expect(getResponse.status()).toBe(404);
    });

    test('DELETE /api/patients/:id - should return 404 for non-existing patient', async ({ request }) => {
        const response = await request.delete(`${API_URL}/api/patients/999`);

        expect(response.status()).toBe(404);

        const body = await response.json();

        expect(body).toEqual({
            error: 'Patient not found'
        });
    });

});
test.describe('Patients API - Negative Testing', () => {

    test('should return 404 when requesting a non-existing patient', async ({ request }) => {

        const response = await request.get('/api/patients/99999');

        expect(response.status()).toBe(404);

        const body = await response.json();

        expect(body).toEqual({
            error: 'Patient not found'
        });
    });


    test('should return 400 when creating a patient without required fields', async ({ request }) => {

        const response = await request.post('/api/patients', {
            data: {
                firstName: 'Test'
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();

        expect(body.error).toContain('required');
    });


    test('should return 404 when updating a non-existing patient', async ({ request }) => {

        const response = await request.put('/api/patients/99999', {
            data: {
                firstName: 'Test',
                lastName: 'Patient',
                dateOfBirth: '1990-01-01',
                email: `negative.${Date.now()}@example.com`,
                phone: '+381641234567'
            }
        });

        expect(response.status()).toBe(404);

        const body = await response.json();

        expect(body).toEqual({
            error: 'Patient not found'
        });
    });


    test('should return 404 when deleting a non-existing patient', async ({ request }) => {

        const response = await request.delete('/api/patients/99999');

        expect(response.status()).toBe(404);

        const body = await response.json();

        expect(body).toEqual({
            error: 'Patient not found'
        });
    });


    test('should return 409 when creating a patient with an existing email', async ({ request }) => {

        const response = await request.post('/api/patients', {
            data: {
                firstName: 'Duplicate',
                lastName: 'Patient',
                dateOfBirth: '1990-01-01',
                email: 'john.smith@example.com',
                phone: '+381641234567'
            }
        });

        expect(response.status()).toBe(409);

        const body = await response.json();

        expect(body).toEqual({
            error: 'Patient with this email already exists'
        });
    });

});