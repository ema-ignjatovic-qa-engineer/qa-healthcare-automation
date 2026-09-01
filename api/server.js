const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('web'));

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'QA Healthcare API is running'
    });
});

// Get all patients
app.get('/api/patients', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS "dateOfBirth",
                email,
                phone
            FROM patients
            ORDER BY id
        `);

        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error fetching patients:', error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Get patient by ID
app.get('/api/patients/:id', async (req, res) => {
    try {
        const patientId = Number(req.params.id);

        const result = await pool.query(`
            SELECT
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS "dateOfBirth",
                email,
                phone
            FROM patients
            WHERE id = $1
        `, [patientId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Patient not found'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Error fetching patient:', error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Create a new patient
app.post('/api/patients', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            dateOfBirth,
            email,
            phone
        } = req.body;

        if (!firstName || !lastName || !dateOfBirth || !email) {
            return res.status(400).json({
                error: 'firstName, lastName, dateOfBirth and email are required'
            });
        }

        const result = await pool.query(`
            INSERT INTO patients
                (first_name, last_name, date_of_birth, email, phone)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS "dateOfBirth",
                email,
                phone
        `, [
            firstName,
            lastName,
            dateOfBirth,
            email,
            phone || null
        ]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error creating patient:', error);

        if (error.code === '23505') {
            return res.status(409).json({
                error: 'Patient with this email already exists'
            });
        }

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Update a patient
app.put('/api/patients/:id', async (req, res) => {
    try {
        const patientId = Number(req.params.id);

        const {
            firstName,
            lastName,
            dateOfBirth,
            email,
            phone
        } = req.body;

        if (!firstName || !lastName || !dateOfBirth || !email) {
            return res.status(400).json({
                error: 'firstName, lastName, dateOfBirth and email are required'
            });
        }

        const result = await pool.query(`
            UPDATE patients
            SET
                first_name = $1,
                last_name = $2,
                date_of_birth = $3,
                email = $4,
                phone = $5
            WHERE id = $6
            RETURNING
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS "dateOfBirth",
                email,
                phone
        `, [
            firstName,
            lastName,
            dateOfBirth,
            email,
            phone || null,
            patientId
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Patient not found'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error('Error updating patient:', error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Delete a patient
app.delete('/api/patients/:id', async (req, res) => {
    try {
        const patientId = Number(req.params.id);

        const result = await pool.query(`
            DELETE FROM patients
            WHERE id = $1
            RETURNING
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS "dateOfBirth",
                email,
                phone
        `, [patientId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Patient not found'
            });
        }

        res.status(200).json({
            message: 'Patient deleted successfully',
            patient: result.rows[0]
        });

    } catch (error) {
        console.error('Error deleting patient:', error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.listen(PORT, () => {
    console.log(`QA Healthcare API running on http://localhost:${PORT}`);
});