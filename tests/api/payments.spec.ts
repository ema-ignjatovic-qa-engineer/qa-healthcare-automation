import { test, expect } from '@playwright/test';
import { db } from '../database/db';

test('should approve a valid card payment', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/payments', {
        data: {
            orderId: 'ORD-1001',
            amount: 50,
            paymentMethod: 'card',
            simulatedResult: 'approved'
        }
    });

    expect(response.status()).toBe(201);

    const payment = await response.json();

    expect(payment.paymentId).toMatch(/^PAY-[0-9a-f-]{36}$/);
    expect(payment.orderId).toBe('ORD-1001');
    expect(payment.amount).toBe('50.00');
    expect(payment.currency).toBe('USD');
    expect(payment.paymentMethod).toBe('card');
    expect(payment.simulatedResult).toBe('approved');
    expect(payment.status).toBe('CAPTURED');
    expect(payment.createdAt).toBeTruthy();
    expect(payment.updatedAt).toBeTruthy();
    const result = await db.query(
    'SELECT * FROM payments WHERE payment_id = $1',
    [payment.paymentId]
);

expect(result.rowCount).toBe(1);

const paymentFromDb = result.rows[0];

expect(paymentFromDb.payment_id).toBe(payment.paymentId);
expect(paymentFromDb.order_id).toBe('ORD-1001');
expect(paymentFromDb.amount).toBe('50.00');
expect(paymentFromDb.currency).toBe('USD');
expect(paymentFromDb.payment_method).toBe('card');
expect(paymentFromDb.simulated_result).toBe('approved');
expect(paymentFromDb.status).toBe('CAPTURED');
});


test('should decline a card payment', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/payments', {
        data: {
            orderId: 'ORD-1002',
            amount: 50,
            paymentMethod: 'card',
            simulatedResult: 'declined'
        }
    });

    console.log('STATUS:', response.status());
    console.log('BODY:', await response.text());

    expect(response.status()).toBe(201);

    const payment = await response.json();

    expect(payment.orderId).toBe('ORD-1002');
    expect(payment.amount).toBe('50.00');
    expect(payment.paymentMethod).toBe('card');
    expect(payment.status).toBe('DECLINED');
});

test('should decline a card payment due to insufficient funds', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/payments', {
        data: {
            orderId: 'ORD-1003',
            amount: 50,
            paymentMethod: 'card',
            simulatedResult: 'insufficient-funds'
        }
    });

    console.log('STATUS:', response.status());
    console.log('BODY:', await response.text());

    expect(response.status()).toBe(201);

    const payment = await response.json();

    expect(payment.orderId).toBe('ORD-1003');
    expect(payment.amount).toBe('50.00');
    expect(payment.paymentMethod).toBe('card');
    expect(payment.status).toBe('DECLINED');
});
test('should decline an expired card payment', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/payments', {
        data: {
            orderId: 'ORD-1004',
            amount: 50,
            paymentMethod: 'card',
            simulatedResult: 'expired-card'
        }
    });

    console.log('STATUS:', response.status());
    console.log('BODY:', await response.text());

    expect(response.status()).toBe(201);

    const payment = await response.json();

    expect(payment.orderId).toBe('ORD-1004');
    expect(payment.amount).toBe('50.00');
    expect(payment.paymentMethod).toBe('card');
    expect(payment.status).toBe('DECLINED');
});
test('should handle payment timeout', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/payments', {
        data: {
            orderId: 'ORD-1005',
            amount: 50,
            paymentMethod: 'card',
            simulatedResult: 'timeout'
        }
    });

    expect(response.status()).toBe(201);

    const payment = await response.json();

    expect(payment.orderId).toBe('ORD-1005');
    expect(payment.amount).toBe('50.00');
    expect(payment.paymentMethod).toBe('card');
    expect(payment.simulatedResult).toBe('timeout');
    expect(payment.status).toBe('TIMEOUT');
});
test('should handle processor error', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/payments', {
        data: {
            orderId: 'ORD-1006',
            amount: 50,
            paymentMethod: 'card',
            simulatedResult: 'processor-error'
        }
    });

    expect(response.status()).toBe(201);

    const payment = await response.json();

    expect(payment.orderId).toBe('ORD-1006');
    expect(payment.amount).toBe('50.00');
    expect(payment.paymentMethod).toBe('card');
    expect(payment.simulatedResult).toBe('processor-error');
    expect(payment.status).toBe('ERROR');
});
test('should reject payment when orderId is missing', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/payments', {
        data: {
            amount: 50,
            paymentMethod: 'card',
            simulatedResult: 'approved'
        }
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe(
        'orderId, amount, paymentMethod and simulatedResult are required'
    );
});
test('should reject payment with invalid amount', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/payments', {
        data: {
            orderId: 'ORD-1007',
            amount: -10,
            paymentMethod: 'card',
            simulatedResult: 'approved'
        }
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe('Payment amount must be greater than 0');
});
test('should reject unsupported payment method', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/payments', {
        data: {
            orderId: 'ORD-1008',
            amount: 50,
            paymentMethod: 'bitcoin',
            simulatedResult: 'approved'
        }
    });

    expect(response.status()).toBe(400);

    const body = await response.json();

    expect(body.error).toBe('Unsupported payment method');
});