const pool = require("../db_test");
const request = require("supertest");
const app = require("../index");
const dotenv = require("dotenv");
dotenv.config();

beforeAll(async () => {
    // create expense table
    await pool.query(
        "CREATE TABLE expense (expense_id SERIAL PRIMARY KEY, description TEXT, owner VARCHAR(50))"
    );
});

beforeEach(async () => {
    // seed with some data
    await pool.query(
        "INSERT INTO expense (owner, description) VALUES ('test', 'Food'), ('test', 'Clothes')"
    );
});

afterEach(async () => {
    await pool.query("DELETE FROM expense");
});

afterAll(async () => {
    await pool.query("DROP TABLE expense");
    pool.end();
});

// Testing endpoint responses and properties

// Test get expense route

describe("GET /expense", () => {
    test("It should fetch our expenses", async (done) => {
        const response = await request(app).get("/expense");
        expect(response.body[0]).toHaveProperty("expense_id");
        expect(response.body[0]).toHaveProperty("description");
        expect(response.statusCode).toBe(200);
        done();
    });
});

// Test post expense route

describe("POST /expense", () => {
    test("It should post expenses", async (done) => {
        const newExpense = await request(app).post("/expense").send({
            description: "Buy more things",
        });
        expect(newExpense.body.description).toBe("Buy more things");
        expect(newExpense.body).toHaveProperty("expense_id");
        expect(newExpense.body).toHaveProperty("description");
        expect(newExpense.statusCode).toBe(200);
        done();
    });
});

// Test update expense route

describe("PUT /expense/:id", () => {
    test("It should update expenses", async (done) => {
        const updatedExpense = await request(app).put(`/expense/1/expense updated`);
        expect(updatedExpense.body).toBe("expense updated");
        expect(updatedExpense.statusCode).toBe(200);
        done();
    });
});

// Test delete expense route

describe("DELETE /expense/:id", () => {
    test("It should delete expenses", async (done) => {
        const newExpense = await request(app).post("/expense").send({
            description: "New expense",
        });
        const removedExpense = await request(app).delete(
            `/expense/${newExpense.body.expense_id}`
        );
        expect(removedExpense.body).toEqual("Expense deleted");
        expect(removedExpense.statusCode).toBe(200);
        done();
    });
});
