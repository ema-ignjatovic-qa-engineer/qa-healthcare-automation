const API_URL = 'http://localhost:3000/api';

const patientsContainer = document.getElementById('patientsContainer');
const loading = document.getElementById('loading');
const message = document.getElementById('message');

const addPatientButton = document.getElementById('addPatientButton');
const patientFormSection = document.getElementById('patientFormSection');
const patientForm = document.getElementById('patientForm');
const cancelButton = document.getElementById('cancelButton');


// Load patients
async function loadPatients() {
    try {
        loading.style.display = 'block';

        const response = await fetch(`${API_URL}/patients`);

        if (!response.ok) {
            throw new Error('Failed to load patients');
        }

        const patients = await response.json();

        patientsContainer.innerHTML = '';

        patients.forEach(patient => {
            const patientCard = document.createElement('div');

            patientCard.className = 'patient-card';

            patientCard.innerHTML = `
                <h3>${patient.firstName} ${patient.lastName}</h3>
                <p><strong>Date of Birth:</strong> ${patient.dateOfBirth}</p>
                <p><strong>Email:</strong> ${patient.email}</p>
                <p><strong>Phone:</strong> ${patient.phone || 'N/A'}</p>
            `;

            patientsContainer.appendChild(patientCard);
        });

    } catch (error) {

        message.textContent = 'Unable to load patients.';
        console.error(error);

    } finally {

        loading.style.display = 'none';
    }
}


// Show form
addPatientButton.addEventListener('click', () => {

    patientFormSection.classList.remove('hidden');

    message.textContent = '';
});


// Hide form
cancelButton.addEventListener('click', () => {

    patientForm.reset();

    patientFormSection.classList.add('hidden');
});


// Create patient
patientForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const patient = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value
    };

    try {

        const response = await fetch(`${API_URL}/patients`, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(patient)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to create patient');
        }

        message.textContent = 'Patient created successfully.';

        patientForm.reset();

        patientFormSection.classList.add('hidden');

        await loadPatients();

    } catch (error) {

        message.textContent = error.message;

        console.error(error);
    }
});


// Initial page load
loadPatients();