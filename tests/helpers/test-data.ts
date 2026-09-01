import { db } from '../database/db';

export async function deletePatientByEmail(email: string) {
    await db.query(
        `
        DELETE FROM patients
        WHERE email = $1
        `,
        [email]
    );
}