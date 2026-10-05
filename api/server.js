const express = require('express');
const pool = require('./db');
const crypto = require('crypto');

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
app.get('/api/test-payments-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM payments');

        res.json({
            connected: true,
            rowCount: result.rowCount
        });
    } catch (error) {
        console.error('Database test error:', error);

        res.status(500).json({
            connected: false,
            error: error.message
        });
    }
});
// Create a simulated payment
app.post('/api/payments', async (req, res) => {
    console.log('PAYMENT ROUTE VERSION: UUID + DB');
    console.log('PAYMENT REQUEST RECEIVED');
    console.log('PAYMENT BODY:', req.body);
    try {
        const {
            orderId,
            amount,
            paymentMethod,
            simulatedResult
        } = req.body;
        if (!orderId || !amount || !paymentMethod || !simulatedResult) {
            return res.status(400).json({
                error: 'orderId, amount, paymentMethod and simulatedResult are required'
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                error: 'Payment amount must be greater than 0'
            });
        }
                const allowedPaymentMethods = [
            'card',
            'contactless',
            'cash',
            'gift-card',
            'digital-wallet'
        ];

        const allowedResults = [
            'approved',
            'declined',
            'insufficient-funds',
            'expired-card',
            'timeout',
            'processor-error'
        ];

        if (!allowedPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({
                error: 'Unsupported payment method'
            });
        }

        if (!allowedResults.includes(simulatedResult)) {
            return res.status(400).json({
                error: 'Unsupported simulated processor result'
            });
        }
                const paymentId = `PAY-${crypto.randomUUID()}`;

        let status;

        switch (simulatedResult) {
            case 'approved':
                status = 'CAPTURED';
                break;

            case 'declined':
                status = 'DECLINED';
                break;

            case 'insufficient-funds':
                status = 'DECLINED';
                break;

            case 'expired-card':
                status = 'DECLINED';
                break;

            case 'timeout':
                status = 'TIMEOUT';
                break;

            case 'processor-error':
                status = 'ERROR';
                break;
        }
            const result = await pool.query(`
                INSERT INTO payments
                (
                    payment_id,
                    order_id,
                    amount,
                    currency,
                    payment_method,
                    simulated_result,
                    status
                )
            VALUES
                ($1, $2, $3, $4, $5, $6, $7)
            RETURNING
                payment_id AS "paymentId",
                order_id AS "orderId",
                amount,
                currency,
                payment_method AS "paymentMethod",
                simulated_result AS "simulatedResult",
                status,
                created_at AS "createdAt",
                updated_at AS "updatedAt"
                `, [
                    paymentId,
                    orderId,
                    amount,
                    'USD',
                    paymentMethod,
                    simulatedResult,
                    status
                ]);
        return res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error('Error processing payment:', error);

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});
console.log(
    app.router.stack
        .filter(layer => layer.route)
        .map(layer => ({
            path: layer.route.path,
            methods: Object.keys(layer.route.methods)
        }))
);
app.listen(PORT, () => {
    console.log(`QA Healthcare API running on http://localhost:${PORT}`);
});