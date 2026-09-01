# QA Healthcare Automation
[![Playwright Tests](https://github.com/ema-ignjatovic-qa-engineer/qa-healthcare-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/ema-ignjatovic-qa-engineer/qa-healthcare-automation/actions/workflows/playwright.yml)
This is a small QA automation project I built to practice and demonstrate different types of testing in one application.

The application is a fictional healthcare patient portal with a simple REST API and PostgreSQL database.
## Application

### Patient Portal

![Patient Portal](docs/patient-portal.jpg)

### Add Patient

![Add Patient](docs/add-patient.jpg)

The main goal of the project is to cover the application from different testing levels — UI, API, database, and integration testing — and to run the automated tests through GitHub Actions.

## Tech Stack

* Playwright
* TypeScript
* Node.js
* Express.js
* PostgreSQL
* pgAdmin
* Git / GitHub
* GitHub Actions

## What is covered

### UI testing

The UI tests cover the main patient management functionality:

* Viewing the patient list
* Searching for a patient
* Opening patient details
* Creating a patient
* Updating patient information
* Deleting a patient
* Basic form validation

### API testing

The REST API is tested using Playwright API requests.

The tests cover:

* GET patients
* GET patient by ID
* POST patient
* PUT patient
* DELETE patient

I also included negative scenarios such as:

* Invalid patient ID
* Patient not found
* Missing required fields
* Duplicate email
* Invalid requests

### Database testing

PostgreSQL is used as the application's database.

The database tests check things such as:

* Patient records
* Searching for a patient by email
* Expected database values
* Data created through the API

### Integration testing

There is also a simple API + database integration test.

The test creates a patient through the API and then checks PostgreSQL to make sure the record was actually stored with the expected values.

The test data is cleaned up after the test finishes.

## Test data and fixtures

I use reusable test data and a Playwright fixture for scenarios where a patient needs to exist before the test starts.

The fixture creates a test patient through the API and removes it after the test.

This keeps the tests independent and avoids relying on permanent test data.

## Running the project

Install the dependencies:

```bash
npm install
```

Start the local API:

```bash
npm start
```

The application runs on:

```text
http://localhost:3000
```

Run the tests:

```bash
npx playwright test
```

Run tests with the browser visible:

```bash
npx playwright test --headed
```

Open the HTML report:

```bash
npx playwright show-report
```

## GitHub Actions

The test suite is also connected to GitHub Actions.

On every push to the main branch, the workflow:

1. Installs the dependencies
2. Installs Playwright browsers
3. Starts PostgreSQL
4. Creates the test database and test data
5. Starts the API
6. Runs the Playwright tests
7. Stores the Playwright report

The current CI run is passing with **60 automated tests**.

## Project structure

```text
qa-healthcare-automation/
│
├── api/
│   ├── data/
│   │   └── patients.js
│   ├── db.js
│   └── server.js
│
├── db/
│   └── init.sql
│
├── tests/
│   ├── api/
│   │   └── patients.spec.ts
│   ├── database/
│   │   ├── db.ts
│   │   └── patients.db.spec.ts
│   ├── integration/
│   │   └── patients.integration.spec.ts
│   ├── ui/
│   │   └── patients.spec.ts
│   ├── fixtures/
│   │   └── patient.fixture.ts
│   └── helpers/
│       └── test-data.ts
│
├── web/
│   ├── app.js
│   ├── index.html
│   └── styles.css
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Why I built this

I wanted to have one project where I could practice more than just UI automation.

The project gave me the opportunity to work with:

* Playwright and TypeScript
* REST APIs
* SQL and PostgreSQL
* API/database integration
* Test data and fixtures
* Negative testing
* Cross-browser testing
* Git and GitHub
* CI with GitHub Actions

The application and all patient data in this project are fictional and created for testing purposes only.
