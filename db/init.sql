CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50)
);

INSERT INTO patients (first_name, last_name, date_of_birth, email, phone)
VALUES
    ('John', 'Smith', '1985-05-15', 'john.smith@example.com', '+381611111111'),
    ('Sarah', 'Johnson', '1990-08-20', 'sarah.johnson@example.com', '+381622222222'),
    ('Michael', 'Brown', '1988-11-10', 'michael.brown@example.com', '+381633333333')
ON CONFLICT (email) DO NOTHING;
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(100) UNIQUE NOT NULL,
    order_id VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL,
    simulated_result VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);