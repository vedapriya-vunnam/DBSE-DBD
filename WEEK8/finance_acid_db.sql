-- =========================================================
-- ACID TRANSACTIONS / TRANSACTION CONTROL
-- =========================================================

-- =========================================================
-- 1. CREATE DATABASE
-- =========================================================

DROP DATABASE IF EXISTS finance_acid_db;
CREATE DATABASE finance_acid_db;
USE finance_acid_db;

-- =========================================================
-- 2. CREATE CUSTOMER TABLE
-- =========================================================

CREATE TABLE client (
    client_id INT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    mobile_no VARCHAR(15),
    city VARCHAR(50)
);

-- =========================================================
-- 3. CREATE ACCOUNT TABLE
-- =========================================================

CREATE TABLE bank_account (
    account_id INT PRIMARY KEY,
    client_id INT,
    account_type VARCHAR(20),
    account_balance DECIMAL(12,2),
    branch_name VARCHAR(50),
    FOREIGN KEY (client_id) REFERENCES client(client_id)
);

-- =========================================================
-- 4. CREATE TRANSACTION TABLE
-- =========================================================

CREATE TABLE account_transaction (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT,
    transaction_type VARCHAR(20),
    transaction_amount DECIMAL(12,2),
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES bank_account(account_id)
);

-- =========================================================
-- 5. INSERT CLIENT DATA
-- =========================================================

INSERT INTO client VALUES
(201,'Aarav Mehta','9123456780','Delhi'),
(202,'Ananya Singh','9123456781','Mumbai'),
(203,'Rohan Gupta','9123456782','Pune'),
(204,'Isha Nair','9123456783','Chennai'),
(205,'Kabir Shah','9123456784','Bangalore');

-- =========================================================
-- 6. INSERT ACCOUNT DATA
-- =========================================================

INSERT INTO bank_account VALUES
(20001,201,'Savings',60000,'Delhi'),
(20002,202,'Savings',85000,'Mumbai'),
(20003,203,'Current',125000,'Pune'),
(20004,204,'Savings',50000,'Chennai'),
(20005,205,'Current',95000,'Bangalore');

-- =========================================================
-- INSERT TRANSACTION DATA
-- =========================================================

INSERT INTO account_transaction
(account_id, transaction_type, transaction_amount)
VALUES
(20001,'DEPOSIT',12000),
(20002,'DEPOSIT',18000),
(20003,'WITHDRAW',25000),
(20004,'DEPOSIT',7000),
(20005,'WITHDRAW',15000);

-- =========================================================
-- DISPLAY INITIAL DATA
-- =========================================================

SELECT * FROM client;

SELECT * FROM bank_account;

SELECT * FROM account_transaction;


-- =========================================================
-- 7. COMMIT EXAMPLE
-- =========================================================

START TRANSACTION;

UPDATE bank_account
SET account_balance = account_balance + 5000
WHERE account_id = 20001;

SELECT *
FROM bank_account
WHERE account_id = 20001;

COMMIT;

SELECT *
FROM bank_account
WHERE account_id = 20001;


-- =========================================================
-- 8. ROLLBACK EXAMPLE
-- =========================================================

START TRANSACTION;

UPDATE bank_account
SET account_balance = account_balance - 10000
WHERE account_id = 20001;

SELECT *
FROM bank_account
WHERE account_id = 20001;

ROLLBACK;

SELECT *
FROM bank_account
WHERE account_id = 20001;


-- =========================================================
-- 9. SAVEPOINT EXAMPLE
-- =========================================================

START TRANSACTION;

UPDATE bank_account
SET account_balance = account_balance + 5000
WHERE account_id = 20001;

SAVEPOINT DepositPoint;

UPDATE bank_account
SET account_balance = account_balance - 3000
WHERE account_id = 20002;

SAVEPOINT WithdrawalPoint;

UPDATE bank_account
SET account_balance = account_balance + 10000
WHERE account_id = 20003;

ROLLBACK TO SAVEPOINT WithdrawalPoint;

COMMIT;

SELECT * FROM bank_account;


-- =========================================================
-- 10. BANK TRANSFER
-- =========================================================

START TRANSACTION;

UPDATE bank_account
SET account_balance = account_balance - 10000
WHERE account_id = 20001;

UPDATE bank_account
SET account_balance = account_balance + 10000
WHERE account_id = 20002;

SELECT account_id, account_balance
FROM bank_account
WHERE account_id IN (20001, 20002);

COMMIT;

SELECT account_id, account_balance
FROM bank_account
WHERE account_id IN (20001, 20002);


-- =========================================================
-- 11. TRANSFER WITH ROLLBACK
-- =========================================================

START TRANSACTION;

UPDATE bank_account
SET account_balance = account_balance - 20000
WHERE account_id = 20001;

UPDATE bank_account
SET account_balance = account_balance + 20000
WHERE account_id = 20002;

SELECT account_id, account_balance
FROM bank_account
WHERE account_id IN (20001, 20002);

ROLLBACK;

SELECT account_id, account_balance
FROM bank_account
WHERE account_id IN (20001, 20002);


-- =========================================================
-- 12. CHECK CURRENT ISOLATION LEVEL
-- =========================================================

SELECT @@SESSION.transaction_isolation;


-- =========================================================
-- 13. READ UNCOMMITTED
-- =========================================================

SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

START TRANSACTION;

SELECT account_balance
FROM bank_account
WHERE account_id = 20001;

COMMIT;


-- =========================================================
-- 14. READ COMMITTED
-- =========================================================

SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;

START TRANSACTION;

SELECT account_balance
FROM bank_account
WHERE account_id = 20001;

COMMIT;


-- =========================================================
-- 15. REPEATABLE READ
-- =========================================================

SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;

START TRANSACTION;

SELECT account_balance
FROM bank_account
WHERE account_id = 20001;

SELECT account_balance
FROM bank_account
WHERE account_id = 20001;

COMMIT;


-- =========================================================
-- 16. SERIALIZABLE
-- =========================================================

SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;

START TRANSACTION;

SELECT *
FROM bank_account
WHERE account_id = 20001;

COMMIT;


-- =========================================================
-- 17. FINAL ACCOUNT DATA
-- =========================================================

SELECT
    A.account_id,
    C.client_name,
    A.account_type,
    A.account_balance,
    A.branch_name
FROM bank_account A
JOIN client C
ON A.client_id = C.client_id
ORDER BY A.account_id;