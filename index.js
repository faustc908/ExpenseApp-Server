const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const PORT = process.env.PORT || 8000;

// Middleware

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CRUD routes

// Route to test routing

app.get("/", function (req, res) {
    const f =
        "<html><head></head><body><form method='put' action='putexpense'>ID:<input name='expense_id' value='1'/><input name='description' value='Not found'/><input type='submit'/></form></body></html>";
    res.send(f);
    res.end();
});

//  Post expense

app.post("/expense", async (req, res) => {
    try {
        const { description } = req.body;
        const newExpense = await pool.query(
            "INSERT INTO expense (owner, description) VALUES('test', $1) RETURNING *",
            [description]
        );
        res.json(newExpense.rows[0]);
        res.end();
    } catch (error) {
        console.error(error.message);
    }
});

// Get all expenses

app.get("/expense", async (req, res) => {
    try {
        const allExpenses = await pool.query("SELECT * FROM expense");
        res.json(allExpenses.rows);
        res.end();
    } catch (error) {
        console.error(error.message);
    }
});

// Get a expense by ID

app.get("/expense/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await pool.query(
            "SELECT * FROM expense WHERE expense_id = $1",
            [id]
        );

        res.json(expense.rows[0]);
        res.end();
    } catch (error) {
        console.error(error.message);
    }
});

// Delete a expense

app.delete("/expense/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const removeExpense = await pool.query(
            "DELETE FROM expense WHERE expense_id = $1",
            [id]
        );
        res.json("Expense deleted");
        res.end();
    } catch (error) {
        console.log(error.message);
    }
});

// Update a Expense

app.put("/expense/:id/:description", async (req, res) => {
    try {
        const { id, description } = req.params;
        const updateExpense = await pool.query(
            "UPDATE expense SET description = $1 WHERE expense_id = $2",
            [description, id]
        );
        console.log("expense updated");
        res.json("expense updated");
        res.end();
    } catch (error) {
        console.error(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

module.exports = app;
