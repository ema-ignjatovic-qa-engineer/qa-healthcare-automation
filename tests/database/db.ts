import { Pool } from 'pg';

export const db = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'qa_healthcare',
    user: process.env.DB_USER || 'emily',
    password: process.env.DB_PASSWORD || ''
});