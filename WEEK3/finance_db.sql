DROP DATABASE IF EXISTS finance_db;

-- Query 1: Create the database
CREATE DATABASE IF NOT EXISTS finance_db;

-- Query 2: Select the database
USE finance_db;

-- Query 3: Create the transactions table
CREATE TABLE financial_transactions (
    transaction_id INT PRIMARY KEY,
    account_holder VARCHAR(50) NOT NULL,
    bank_branch VARCHAR(50) NOT NULL,
    transaction_category VARCHAR(20) NOT NULL,
    transaction_amount DECIMAL(10,2) NOT NULL,
    transaction_date DATE
);

-- Query 4: Inspect the table structure
DESCRIBE financial_transactions;

-- Query 5: Insert transaction records
INSERT INTO financial_transactions
(transaction_id, account_holder, bank_branch, transaction_category, transaction_amount, transaction_date)
VALUES
(201, 'Arjun', 'Chennai', 'Deposit', 6000, '2024-02-05'),
(202, 'Meena', 'Chennai', 'Withdrawal', 2500, '2024-02-06'),
(203, 'Vikram', 'Bangalore', 'Deposit', 14000, '2024-02-08'),
(204, 'Divya', 'Mumbai', 'Deposit', 9000, '2024-02-10'),
(205, 'Neha', 'Chennai', 'Withdrawal', 3000, '2024-02-11'),
(206, 'Suresh', 'Mumbai', 'Deposit', 16000, '2024-02-12'),
(207, 'Pooja', 'Bangalore', 'Withdrawal', 1500, '2024-02-13'),
(208, 'Arun', 'Chennai', 'Deposit', 10000, '2024-02-14'),
(209, 'Kavya', 'Mumbai', 'Withdrawal', 4500, '2024-02-15'),
(210, 'Manoj', 'Bangalore', 'Deposit', 12000, '2024-02-16');

-- Query 6: Display all transactions
SELECT * FROM financial_transactions;


-- Query 7: Find total transaction amount using SUM()
SELECT SUM(transaction_amount) AS Total_Amount
FROM financial_transactions;


-- Query 8: Find average transaction amount using AVG()
SELECT AVG(transaction_amount) AS Average_Transaction
FROM financial_transactions;


-- Query 9: Find highest transaction using MAX()
SELECT MAX(transaction_amount) AS Highest_Transaction
FROM financial_transactions;


-- Query 10: Find lowest transaction using MIN()
SELECT MIN(transaction_amount) AS Lowest_Transaction
FROM financial_transactions;


-- Query 11: Count total transactions using COUNT()
SELECT COUNT(*) AS Total_Transactions
FROM financial_transactions;


-- Query 12: Find total deposit amount
SELECT SUM(transaction_amount) AS Total_Deposit
FROM financial_transactions
WHERE transaction_category = 'Deposit';


-- Query 13: Find total amount for each branch
SELECT bank_branch,
       SUM(transaction_amount) AS Total_Amount
FROM financial_transactions
GROUP BY bank_branch;


-- Query 14: Find branches with total amount greater than 20000
SELECT bank_branch,
       SUM(transaction_amount) AS Total_Amount
FROM financial_transactions
GROUP BY bank_branch
HAVING SUM(transaction_amount) > 20000;


-- Query 15: Display branches according to total amount
SELECT bank_branch,
       SUM(transaction_amount) AS Total_Amount
FROM financial_transactions
GROUP BY bank_branch
ORDER BY Total_Amount DESC;


-- Query 16: Find branches having at least 3 transactions
SELECT bank_branch,
       COUNT(*) AS Total_Transactions
FROM financial_transactions
GROUP BY bank_branch
HAVING COUNT(*) >= 3
ORDER BY Total_Transactions DESC;


-- Query 17: Count total withdrawals
SELECT COUNT(*) AS Withdrawals
FROM financial_transactions
WHERE transaction_category = 'Withdrawal';


-- Query 18: Find average deposit amount
SELECT AVG(transaction_amount) AS Average_Deposit
FROM financial_transactions
WHERE transaction_category = 'Deposit';


-- Query 19: Find highest transaction in each branch
SELECT bank_branch,
       MAX(transaction_amount) AS Highest_Amount
FROM financial_transactions
GROUP BY bank_branch;


-- Query 20: Find lowest transaction in each branch
SELECT bank_branch,
       MIN(transaction_amount) AS Lowest_Amount
FROM financial_transactions
GROUP BY bank_branch;


-- Query 21: Display transactions above 8000
SELECT *
FROM financial_transactions
WHERE transaction_amount > 8000
ORDER BY transaction_amount DESC;


-- Query 22: Count transactions in each branch
SELECT bank_branch,
       COUNT(*) AS Transaction_Count
FROM financial_transactions
GROUP BY bank_branch;


-- Query 23: Find branches having more than 3 transactions
SELECT bank_branch,
       COUNT(*) AS Total_Transactions
FROM financial_transactions
GROUP BY bank_branch
HAVING COUNT(*) > 3;


-- Query 24: Find average transaction amount for each branch
SELECT bank_branch,
       AVG(transaction_amount) AS Average_Amount
FROM financial_transactions
GROUP BY bank_branch;


-- Query 25: Find branches where total deposits exceed 15000
SELECT bank_branch,
       SUM(transaction_amount) AS Total_Deposit
FROM financial_transactions
WHERE transaction_category = 'Deposit'
GROUP BY bank_branch
HAVING SUM(transaction_amount) > 15000;


-- Query 26: Find branches with average transaction above 7000
SELECT bank_branch,
       AVG(transaction_amount) AS Average_Amount
FROM financial_transactions
GROUP BY bank_branch
HAVING AVG(transaction_amount) > 7000
ORDER BY Average_Amount DESC;


-- Test 1: Duplicate Transaction ID
INSERT INTO financial_transactions
(transaction_id, account_holder, bank_branch, transaction_category, transaction_amount, transaction_date)
VALUES
(201, 'Rahul', 'Delhi', 'Deposit', 5000, '2024-02-20');


-- Test 2: NULL Account Holder
INSERT INTO financial_transactions
(transaction_id, account_holder, bank_branch, transaction_category, transaction_amount, transaction_date)
VALUES
(211, NULL, 'Delhi', 'Deposit', 7000, '2024-02-20');


-- Test 3: NULL Branch
INSERT INTO financial_transactions
(transaction_id, account_holder, bank_branch, transaction_category, transaction_amount, transaction_date)
VALUES
(212, 'Riya', NULL, 'Deposit', 8000, '2024-02-21');


-- Test 4: NULL Transaction Amount
INSERT INTO financial_transactions
(transaction_id, account_holder, bank_branch, transaction_category, transaction_amount, transaction_date)
VALUES
(213, 'Varun', 'Delhi', 'Deposit', NULL, '2024-02-21');
SELECT
    COUNT(*) AS Total_Transactions,
    SUM(transaction_amount) AS Total_Amount,
    AVG(transaction_amount) AS Average_Amount,
    MAX(transaction_amount) AS Highest_Amount,
    MIN(transaction_amount) AS Lowest_Amount
FROM financial_transactions;
