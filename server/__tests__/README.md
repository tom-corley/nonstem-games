# Testing Documentation for Nonstem Games API

This folder contains all the unit and integration tests for the Nonstem Games API backend.

---

## Overview

The tests cover the main **User** and **Question** resources and their RESTful API routes, including:

- Creating, reading, updating, and deleting users and questions
- Proper error handling for invalid inputs and server errors
- Mocking the database models to isolate controller and route logic

---

## 🧰 Prerequisites

Before running tests, make sure you have installed **all project dependencies** from the root directory, including:

- Node.js and npm
- PostgreSQL (`pg`)
- Express
- Jest (for testing)
- Supertest (for HTTP integration testing)
- Other dependencies listed in the main `package.json`

## Testing Tools

- [Jest](https://jestjs.io/) — JavaScript testing framework used for running tests.
- [Supertest](https://www.npmjs.com/package/supertest) — To test HTTP requests against the Express app.
- Jest Mock Functions — Used to mock database model methods.

---

## How to Run Tests

From the root of the project, run:

```bash
npm install
npm test

## 📋 What’s Tested?
Controllers: User and Question controllers, including CRUD operations.
Routes: Express API routes for Users and Questions.
Error Handling: Tests for invalid IDs, missing fields, and simulated server errors.

## 🧩 Mocking Setup
Models (User, Question) are mocked using Jest to isolate controller logic.
Database calls are simulated to test different scenarios and edge cases without hitting the real database.
HTTP requests to the Express app are tested using Supertest.

## 🚦 Test Coverage
All CRUD operations for Users and Questions.
Handling of common errors like 404 (not found), 400 (bad request), and 500 (server errors).

## 🐞 Debugging Tips
Ensure your PostgreSQL database is running if you run integration tests without mocks.
Use console.log statements in your controllers and tests to trace issues.
Clear Jest mocks before each test to avoid test pollution.

## 🤝 Contribution
If you add new features or fix bugs in controllers or routes, please add relevant tests in this folder and update this documentation accordingly.

By David Buari (GROUP 4)