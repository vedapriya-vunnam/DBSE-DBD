-- ============================================================
-- WEEK 7 - FINANCE DATABASE: SQL VIEWS
-- ============================================================

-- STEP 1: DATABASE

DROP DATABASE IF EXISTS finance_views;

CREATE DATABASE IF NOT EXISTS finance_views;

USE finance_views;


-- ============================================================
-- 1. CLIENT TABLE
-- ============================================================

CREATE TABLE client (
    client_id INT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    phone_no VARCHAR(15),
    email_id VARCHAR(100),
    city_name VARCHAR(50)
);


-- ============================================================
-- 2. ACCOUNT TABLE
-- ============================================================

CREATE TABLE bank_account (
    account_id INT PRIMARY KEY,
    client_id INT,
    account_category VARCHAR(20),
    account_balance DECIMAL(12,2),
    branch_name VARCHAR(50),

    FOREIGN KEY (client_id)
    REFERENCES client(client_id)
);


-- ============================================================
-- 3. TRANSACTION TABLE
-- ============================================================

CREATE TABLE account_transaction (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT,
    transaction_category VARCHAR(20),
    transaction_amount DECIMAL(12,2),
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (account_id)
    REFERENCES bank_account(account_id)
);


-- ============================================================
-- 4. LOAN TABLE
-- ============================================================

CREATE TABLE client_loan (
    loan_id INT PRIMARY KEY,
    client_id INT,
    loan_category VARCHAR(30),
    loan_amount DECIMAL(12,2),
    interest_rate DECIMAL(5,2),

    FOREIGN KEY (client_id)
    REFERENCES client(client_id)
);


-- ============================================================
-- 5. CLIENT DATA
-- ============================================================

INSERT INTO client VALUES
(201,'Aarav Mehta','9000011111','aarav@gmail.com','Delhi'),
(202,'Ananya Singh','9000011112','ananya@gmail.com','Mumbai'),
(203,'Rohan Gupta','9000011113','rohan@gmail.com','Bangalore'),
(204,'Isha Nair','9000011114','isha@gmail.com','Chennai'),
(205,'Kabir Shah','9000011115','kabir@gmail.com','Delhi'),
(206,'Neha Kapoor','9000011116','neha@gmail.com','Mumbai'),
(207,'Vivek Rao','9000011117','vivek@gmail.com','Pune'),
(208,'Tanya Das','9000011118','tanya@gmail.com','Kolkata'),
(209,'Aditya Jain','9000011119','aditya@gmail.com','Delhi'),
(210,'Meera Joshi','9000011120','meera@gmail.com','Mumbai');


-- ============================================================
-- 6. ACCOUNT DATA
-- ============================================================

INSERT INTO bank_account VALUES
(20001,201,'Savings',60000,'Delhi'),
(20002,202,'Savings',80000,'Mumbai'),
(20003,203,'Current',130000,'Bangalore'),
(20004,204,'Savings',55000,'Chennai'),
(20005,205,'Current',95000,'Delhi'),
(20006,206,'Savings',70000,'Mumbai'),
(20007,207,'Current',160000,'Pune'),
(20008,208,'Savings',40000,'Kolkata'),
(20009,209,'Savings',90000,'Delhi'),
(20010,210,'Current',115000,'Mumbai');


-- ============================================================
-- 7. TRANSACTION DATA
-- ============================================================

INSERT INTO account_transaction
(account_id, transaction_category, transaction_amount)
VALUES
(20001,'DEPOSIT',12000),
(20001,'WITHDRAW',4000),
(20002,'DEPOSIT',18000),
(20003,'WITHDRAW',25000),
(20004,'DEPOSIT',7000),
(20005,'WITHDRAW',15000),
(20006,'DEPOSIT',14000),
(20007,'DEPOSIT',30000),
(20008,'WITHDRAW',6000),
(20009,'DEPOSIT',22000),
(20010,'WITHDRAW',18000);


-- ============================================================
-- 8. LOAN DATA
-- ============================================================

INSERT INTO client_loan VALUES
(601,201,'Home Loan',4500000,7.2),
(602,202,'Education Loan',1200000,6.8),
(603,203,'Car Loan',900000,8.5),
(604,204,'Personal Loan',600000,10.2),
(605,205,'Home Loan',3500000,7.5),
(606,206,'Car Loan',850000,8.3),
(607,207,'Business Loan',2800000,9.2),
(608,209,'Personal Loan',700000,10.0);


-- ============================================================
-- 9. DISPLAY ORIGINAL TABLES
-- ============================================================

SELECT * FROM client;

SELECT * FROM bank_account;

SELECT * FROM account_transaction;

SELECT * FROM client_loan;


-- ============================================================
-- SIMPLE VIEWS
-- ============================================================

-- Query 1: Complete client view

CREATE VIEW Client_View AS
SELECT *
FROM client;

SELECT * FROM Client_View;


-- Query 2: Basic client information

CREATE VIEW Client_Basic_View AS
SELECT client_id, client_name, city_name
FROM client;

SELECT * FROM Client_Basic_View;


-- Query 3: Account information

CREATE VIEW Account_View AS
SELECT
    account_id,
    account_category,
    account_balance,
    branch_name
FROM bank_account;

SELECT * FROM Account_View;


-- Query 4: Savings accounts

CREATE VIEW Savings_Account_View AS
SELECT *
FROM bank_account
WHERE account_category = 'Savings';

SELECT * FROM Savings_Account_View;


-- Query 5: Current accounts

CREATE VIEW Current_Account_View AS
SELECT *
FROM bank_account
WHERE account_category = 'Current';

SELECT * FROM Current_Account_View;


-- ============================================================
-- VIEWS WITH CONDITIONS
-- ============================================================

-- Query 6: High balance accounts

CREATE VIEW High_Balance_View AS
SELECT
    account_id,
    client_id,
    account_category,
    account_balance
FROM bank_account
WHERE account_balance > 100000;

SELECT * FROM High_Balance_View;


-- Query 7: Delhi accounts

CREATE VIEW Delhi_Account_View AS
SELECT *
FROM bank_account
WHERE branch_name = 'Delhi';

SELECT * FROM Delhi_Account_View;


-- Query 8: Low balance accounts

CREATE VIEW Low_Balance_View AS
SELECT
    account_id,
    client_id,
    account_balance
FROM bank_account
WHERE account_balance < 50000;

SELECT * FROM Low_Balance_View;


-- ============================================================
-- VIEWS USING JOINS
-- ============================================================

-- Query 9: Client and account details

CREATE VIEW Client_Account_View AS
SELECT
    C.client_id,
    C.client_name,
    C.city_name,
    A.account_id,
    A.account_category,
    A.account_balance,
    A.branch_name
FROM client C
JOIN bank_account A
ON C.client_id = A.client_id;

SELECT * FROM Client_Account_View;


-- Query 10: Delhi customer accounts

CREATE VIEW Delhi_Client_Accounts AS
SELECT
    C.client_name,
    C.city_name,
    A.account_id,
    A.account_category,
    A.account_balance
FROM client C
JOIN bank_account A
ON C.client_id = A.client_id
WHERE A.branch_name = 'Delhi';

SELECT * FROM Delhi_Client_Accounts;


-- Query 11: Client loan information

CREATE VIEW Client_Loan_View AS
SELECT
    C.client_id,
    C.client_name,
    C.city_name,
    L.loan_id,
    L.loan_category,
    L.loan_amount,
    L.interest_rate
FROM client C
JOIN client_loan L
ON C.client_id = L.client_id;

SELECT * FROM Client_Loan_View;


-- Query 12: Complete banking information

CREATE VIEW Client_Banking_View AS
SELECT
    C.client_id,
    C.client_name,
    C.city_name,
    A.account_id,
    A.account_category,
    A.account_balance,
    A.branch_name,
    L.loan_category,
    L.loan_amount
FROM client C
LEFT JOIN bank_account A
ON C.client_id = A.client_id
LEFT JOIN client_loan L
ON C.client_id = L.client_id;

SELECT * FROM Client_Banking_View;


-- ============================================================
-- AGGREGATE VIEWS
-- ============================================================

-- Query 13: Total bank balance

CREATE VIEW Total_Bank_Balance AS
SELECT SUM(account_balance) AS Total_Balance
FROM bank_account;

SELECT * FROM Total_Bank_Balance;


-- Query 14: Average account balance

CREATE VIEW Average_Account_Balance AS
SELECT AVG(account_balance) AS Average_Balance
FROM bank_account;

SELECT * FROM Average_Account_Balance;


-- Query 15: Maximum balance

CREATE VIEW Maximum_Balance_View AS
SELECT MAX(account_balance) AS Maximum_Balance
FROM bank_account;

SELECT * FROM Maximum_Balance_View;


-- Query 16: Minimum balance

CREATE VIEW Minimum_Balance_View AS
SELECT MIN(account_balance) AS Minimum_Balance
FROM bank_account;

SELECT * FROM Minimum_Balance_View;


-- Query 17: Total accounts

CREATE VIEW Account_Count_View AS
SELECT COUNT(*) AS Total_Accounts
FROM bank_account;

SELECT * FROM Account_Count_View;


-- ============================================================
-- GROUP BY VIEWS
-- ============================================================

-- Query 18: Number of accounts in each branch

CREATE VIEW Branch_Account_Count AS
SELECT
    branch_name,
    COUNT(*) AS Number_of_Accounts
FROM bank_account
GROUP BY branch_name;

SELECT * FROM Branch_Account_Count;


-- Query 19: Total balance by branch

CREATE VIEW Branch_Total_Balance AS
SELECT
    branch_name,
    SUM(account_balance) AS Total_Balance
FROM bank_account
GROUP BY branch_name;

SELECT * FROM Branch_Total_Balance;


-- Query 20: Account count by type

CREATE VIEW Account_Type_Count AS
SELECT
    account_category,
    COUNT(*) AS Number_of_Accounts
FROM bank_account
GROUP BY account_category;

SELECT * FROM Account_Type_Count;


-- Query 21: Balance by account type

CREATE VIEW Account_Type_Balance AS
SELECT
    account_category,
    SUM(account_balance) AS Total_Balance
FROM bank_account
GROUP BY account_category;

SELECT * FROM Account_Type_Balance;


-- ============================================================
-- HAVING VIEWS
-- ============================================================

-- Query 22: Branches with multiple accounts

CREATE VIEW Multiple_Account_Branches AS
SELECT
    branch_name,
    COUNT(*) AS Number_of_Accounts
FROM bank_account
GROUP BY branch_name
HAVING COUNT(*) > 1;

SELECT * FROM Multiple_Account_Branches;


-- Query 23: Branches with high total balance

CREATE VIEW Rich_Branches AS
SELECT
    branch_name,
    SUM(account_balance) AS Total_Balance
FROM bank_account
GROUP BY branch_name
HAVING SUM(account_balance) > 100000;

SELECT * FROM Rich_Branches;


-- ============================================================
-- TRANSACTION VIEWS
-- ============================================================

-- Query 24: Deposit transactions

CREATE VIEW Deposit_Transaction_View AS
SELECT *
FROM account_transaction
WHERE transaction_category = 'DEPOSIT';

SELECT * FROM Deposit_Transaction_View;


-- Query 25: Withdrawal transactions

CREATE VIEW Withdrawal_Transaction_View AS
SELECT *
FROM account_transaction
WHERE transaction_category = 'WITHDRAW';

SELECT * FROM Withdrawal_Transaction_View;


-- Query 26: Customer transaction details

CREATE VIEW Client_Transaction_View AS
SELECT
    C.client_name,
    A.account_id,
    A.account_category,
    T.transaction_id,
    T.transaction_category,
    T.transaction_amount,
    T.transaction_date
FROM client C
JOIN bank_account A
ON C.client_id = A.client_id
JOIN account_transaction T
ON A.account_id = T.account_id;

SELECT * FROM Client_Transaction_View;


-- Query 27: High value transactions

CREATE VIEW High_Value_Transaction_View AS
SELECT *
FROM account_transaction
WHERE transaction_amount > 10000;

SELECT * FROM High_Value_Transaction_View;


-- ============================================================
-- ORDER BY VIEWS
-- ============================================================

-- Query 28: Balance ranking

CREATE VIEW Balance_Ranking_View AS
SELECT
    account_id,
    client_id,
    account_category,
    account_balance
FROM bank_account
ORDER BY account_balance DESC;

SELECT * FROM Balance_Ranking_View;


-- Query 29: Clients alphabetically

CREATE VIEW Client_Name_View AS
SELECT
    client_id,
    client_name,
    city_name
FROM client
ORDER BY client_name;

SELECT * FROM Client_Name_View;


-- ============================================================
-- CALCULATED COLUMN VIEWS
-- ============================================================

-- Query 30: Annual loan interest

CREATE VIEW Loan_Interest_View AS
SELECT
    loan_id,
    client_id,
    loan_category,
    loan_amount,
    interest_rate,
    (loan_amount * interest_rate / 100) AS Annual_Interest
FROM client_loan;

SELECT * FROM Loan_Interest_View;


-- Query 31: Loan amount including annual interest

CREATE VIEW Loan_Total_Amount_View AS
SELECT
    loan_id,
    client_id,
    loan_category,
    loan_amount,
    interest_rate,
    loan_amount +
    (loan_amount * interest_rate / 100) AS Total_Amount
FROM client_loan;

SELECT * FROM Loan_Total_Amount_View;


-- ============================================================
-- USING VIEWS WITH QUERIES
-- ============================================================

-- Query 32

SELECT *
FROM High_Balance_View
WHERE account_balance > 120000;


-- Query 33

SELECT *
FROM Savings_Account_View
WHERE account_balance > 60000;


-- Query 34

SELECT *
FROM Delhi_Account_View
WHERE account_balance > 50000;


-- Query 35

SELECT *
FROM Client_Basic_View
WHERE city_name = 'Delhi';


-- Query 36

SELECT *
FROM Client_Account_View
ORDER BY account_balance DESC;


-- Query 37

SELECT *
FROM Client_Loan_View
WHERE loan_amount > 1000000;


-- ============================================================
-- UPDATE THROUGH VIEW
-- ============================================================

-- Query 38

UPDATE Account_View
SET account_balance = 65000
WHERE account_id = 20001;

SELECT *
FROM bank_account
WHERE account_id = 20001;


-- ============================================================
-- INSERT THROUGH VIEW
-- ============================================================

-- Query 39

CREATE VIEW Simple_Account_View AS
SELECT
    account_id,
    client_id,
    account_category,
    account_balance,
    branch_name
FROM bank_account;


INSERT INTO Simple_Account_View
VALUES
(20011,201,'Savings',58000,'Delhi');

SELECT *
FROM bank_account;


-- ============================================================
-- DELETE THROUGH VIEW
-- ============================================================

-- Query 40

DELETE FROM Simple_Account_View
WHERE account_id = 20011;

SELECT *
FROM bank_account;


-- ============================================================
-- VIEW INFORMATION
-- ============================================================

-- Query 41

SHOW FULL TABLES
WHERE TABLE_TYPE = 'VIEW';


-- Query 42

SHOW CREATE VIEW Client_Account_View;


-- Query 43

DESCRIBE Client_Account_View;


-- ============================================================
-- FINAL OUTPUT
-- ============================================================

-- Query 44: Complete customer-account summary

SELECT
    C.client_id,
    C.client_name,
    C.city_name,
    A.account_id,
    A.account_category,
    A.account_balance,
    A.branch_name
FROM client C
JOIN bank_account A
ON C.client_id = A.client_id
ORDER BY C.client_id;