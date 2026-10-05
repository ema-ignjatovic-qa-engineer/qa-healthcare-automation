const API_URL = 'http://localhost:3000/api/patients';

const NUMBER_OF_PATIENTS = 50;

async function createBulkPatients() {
    const createdPatients = [];

    for (let i = 1; i <= NUMBER_OF_PATIENTS; i++) {
        const patient = {
            firstName: `TestPatient${i}`,
            lastName: 'Bulk',
            dateOfBirth: '1990-01-01',
            email: `testpatient${i}_${Date.now()}@example.com`,
            phone: `+1-555-${String(i).padStart(4, '0')}`
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(patient)
            });

            if (!response.ok) {
                console.error(
                    `Failed to create patient ${i}: ${response.status}`
                );
                continue;
            }

            const createdPatient = await response.json();

            createdPatients.push(createdPatient);

            console.log(
                `Created patient ${i}/${NUMBER_OF_PATIENTS}: ID ${createdPatient.id}`
            );
        } catch (error) {
            console.error(
                `Error creating patient ${i}:`,
                error
            );
        }
    }

    console.log(
        `\nBulk creation completed. Created ${createdPatients.length} patients.`
    );
}

createBulkPatients();