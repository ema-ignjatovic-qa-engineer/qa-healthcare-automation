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
const payButton = document.getElementById('payButton');
const paymentMethod = document.getElementById('paymentMethod');
const paymentAmount = document.getElementById('paymentAmount');
const paymentStatus = document.getElementById('paymentStatus');
const paymentResult = document.getElementById('paymentResult');

payButton.addEventListener('click', async () => {
    const method = paymentMethod.value;
    const amount = Number(paymentAmount.value);
    const result = paymentResult.value;

    if (!method) {
        paymentStatus.textContent = 'Please select a payment method.';
        return;
    }

    if (!amount || amount <= 0) {
        paymentStatus.textContent = 'Please enter a valid payment amount.';
        return;
    }

    paymentStatus.textContent = 'Processing payment...';

    try {
        const response = await fetch('/api/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId: 'ORD-1001',
                amount: amount,
                paymentMethod: method,
                simulatedResult: result
            })
        });

        const payment = await response.json();

        if (!response.ok) {
            paymentStatus.textContent = payment.error || 'Payment failed';
            return;
        }

        switch (payment.status) {
            case 'CAPTURED':
                paymentStatus.textContent = 'Payment successful';
                break;

            case 'DECLINED':
                paymentStatus.textContent = 'Payment declined';
                break;

            case 'TIMEOUT':
                paymentStatus.textContent = 'Payment timeout';
                break;

            case 'ERROR':
                paymentStatus.textContent = 'Payment failed: processor error';
                break;

            default:
                paymentStatus.textContent = 'Unknown payment status';
        }

    } catch (error) {
        console.error('Payment request failed:', error);
        paymentStatus.textContent = 'Payment request failed';
    }
});