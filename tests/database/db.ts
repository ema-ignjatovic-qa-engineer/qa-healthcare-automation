import { Pool } from 'pg';

export const db = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'qa_healthcare',
    user: 'emily',
    password: ''
});