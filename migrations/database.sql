CREATE TABLE expense
(
    expense_id SERIAL PRIMARY KEY,
    description TEXT,
    owner VARCHAR(50)
);