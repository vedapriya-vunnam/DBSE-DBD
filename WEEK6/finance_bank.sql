-- ============================================================
-- WEEK 6 - BANK DATABASE: TRIGGERS AND STORED PROCEDURES
-- ============================================================

-- STEP 1: DATABASE

DROP DATABASE IF EXISTS finance_bank;

CREATE DATABASE IF NOT EXISTS finance_bank;

USE finance_bank;


-- ============================================================
-- 1. CLIENT TABLE
-- ============================================================

CREATE TABLE client (
    client_id INT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    contact_no VARCHAR(15),
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
    account_balance DECIMAL(12,2) DEFAULT 0,
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
    transaction_time DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (account_id)
    REFERENCES bank_account(account_id)
);


-- ============================================================
-- 4. LOAN TABLE
-- ============================================================

CREATE TABLE customer_loan (
    loan_id INT PRIMARY KEY,
    client_id INT,
    loan_category VARCHAR(30),
    loan_value DECIMAL(12,2),
    interest_percent DECIMAL(5,2),

    FOREIGN KEY (client_id)
    REFERENCES client(client_id)
);


-- ============================================================
-- 5. INSERT CLIENT DATA
-- ============================================================

INSERT INTO client
(client_id, client_name, contact_no, email_id, city_name)
VALUES
(201, 'Aarav Mehta', '9000011111', 'aarav@gmail.com', 'Delhi'),
(202, 'Ananya Singh', '9000011112', 'ananya@gmail.com', 'Mumbai'),
(203, 'Rohan Gupta', '9000011113', 'rohan@gmail.com', 'Bangalore'),
(204, 'Isha Nair', '9000011114', 'isha@gmail.com', 'Chennai'),
(205, 'Kabir Shah', '9000011115', 'kabir@gmail.com', 'Delhi');


-- ============================================================
-- 6. INSERT ACCOUNT DATA
-- ============================================================

INSERT INTO bank_account
(account_id, client_id, account_category, account_balance, branch_name)
VALUES
(20001, 201, 'Savings', 60000, 'Delhi'),
(20002, 202, 'Savings', 80000, 'Mumbai'),
(20003, 203, 'Current', 130000, 'Bangalore'),
(20004, 204, 'Savings', 55000, 'Chennai'),
(20005, 205, 'Current', 95000, 'Delhi');


-- ============================================================
-- 7. INSERT TRANSACTION DATA
-- ============================================================

INSERT INTO account_transaction
(account_id, transaction_category, transaction_amount)
VALUES
(20001, 'DEPOSIT', 12000),
(20002, 'DEPOSIT', 18000),
(20003, 'WITHDRAW', 25000),
(20004, 'DEPOSIT', 7000),
(20005, 'WITHDRAW', 12000);


-- ============================================================
-- 8. INSERT LOAN DATA
-- ============================================================

INSERT INTO customer_loan
(loan_id, client_id, loan_category, loan_value, interest_percent)
VALUES
(601, 201, 'Home Loan', 4500000, 7.2),
(602, 202, 'Education Loan', 1200000, 6.8),
(603, 203, 'Car Loan', 900000, 8.5),
(604, 204, 'Personal Loan', 600000, 10.2);


-- ============================================================
-- 9. DISPLAY TABLES
-- ============================================================

SELECT * FROM client;

SELECT * FROM bank_account;

SELECT * FROM account_transaction;

SELECT * FROM customer_loan;


-- ============================================================
-- 10. STORED PROCEDURE - ALL CLIENTS
-- ============================================================

DELIMITER //

CREATE PROCEDURE ShowAllClients()
BEGIN
    SELECT * FROM client;
END //

DELIMITER ;

CALL ShowAllClients();


-- ============================================================
-- 11. STORED PROCEDURE - ACCOUNT DETAILS
-- ============================================================

DELIMITER //

CREATE PROCEDURE ShowAccountDetails(
    IN p_Account_ID INT
)
BEGIN
    SELECT *
    FROM bank_account
    WHERE account_id = p_Account_ID;
END //

DELIMITER ;

CALL ShowAccountDetails(20001);


-- ============================================================
-- 12. STORED PROCEDURE - CLIENT ACCOUNTS
-- ============================================================

DELIMITER //

CREATE PROCEDURE ShowClientAccounts(
    IN p_Client_ID INT
)
BEGIN

    SELECT
        C.client_id,
        C.client_name,
        A.account_id,
        A.account_category,
        A.account_balance,
        A.branch_name
    FROM client C
    JOIN bank_account A
    ON C.client_id = A.client_id
    WHERE C.client_id = p_Client_ID;

END //

DELIMITER ;

CALL ShowClientAccounts(201);


-- ============================================================
-- 13. DEPOSIT PROCEDURE
-- ============================================================

DELIMITER //

CREATE PROCEDURE AddDeposit(
    IN p_Account_ID INT,
    IN p_Amount DECIMAL(12,2)
)
BEGIN

    UPDATE bank_account
    SET account_balance = account_balance + p_Amount
    WHERE account_id = p_Account_ID;

END //

DELIMITER ;

CALL AddDeposit(20001, 6000);

SELECT *
FROM bank_account
WHERE account_id = 20001;


-- ============================================================
-- 14. WITHDRAW PROCEDURE
-- ============================================================

DELIMITER //

CREATE PROCEDURE RemoveMoney(
    IN p_Account_ID INT,
    IN p_Amount DECIMAL(12,2)
)
BEGIN

    UPDATE bank_account
    SET account_balance = account_balance - p_Amount
    WHERE account_id = p_Account_ID;

END //

DELIMITER ;

CALL RemoveMoney(20001, 4000);

SELECT *
FROM bank_account
WHERE account_id = 20001;


-- ============================================================
-- 15. TRIGGER - PREVENT NEGATIVE BALANCE
-- ============================================================

DELIMITER //

CREATE TRIGGER ValidateAccountBalance
BEFORE UPDATE ON bank_account
FOR EACH ROW
BEGIN

    IF NEW.account_balance < 0 THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
        'Transaction failed: Insufficient balance';

    END IF;

END //

DELIMITER ;


-- TEST

UPDATE bank_account
SET account_balance = account_balance - 100000
WHERE account_id = 20001;


-- ============================================================
-- 16. TRIGGER - PREVENT INVALID TRANSACTION
-- ============================================================

DELIMITER //

CREATE TRIGGER ValidateTransactionAmount
BEFORE INSERT ON account_transaction
FOR EACH ROW
BEGIN

    IF NEW.transaction_amount <= 0 THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
        'Transaction amount must be greater than zero';

    END IF;

END //

DELIMITER ;


-- TEST

INSERT INTO account_transaction
(account_id, transaction_category, transaction_amount)
VALUES
(20001, 'DEPOSIT', -7000);


-- ============================================================
-- 17. TRANSACTION AUDIT TABLE
-- ============================================================

CREATE TABLE transaction_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_id INT,
    account_id INT,
    transaction_category VARCHAR(20),
    transaction_amount DECIMAL(12,2),
    history_time DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- 18. TRANSACTION AUDIT TRIGGER
-- ============================================================

DELIMITER //

CREATE TRIGGER RecordTransactionHistory
AFTER INSERT ON account_transaction
FOR EACH ROW
BEGIN

    INSERT INTO transaction_history
    (
        transaction_id,
        account_id,
        transaction_category,
        transaction_amount
    )
    VALUES
    (
        NEW.transaction_id,
        NEW.account_id,
        NEW.transaction_category,
        NEW.transaction_amount
    );

END //

DELIMITER ;


-- TEST

INSERT INTO account_transaction
(account_id, transaction_category, transaction_amount)
VALUES
(20001, 'DEPOSIT', 3000);

SELECT *
FROM transaction_history;


-- ============================================================
-- 19. AUTOMATIC BALANCE UPDATE TRIGGER
-- ============================================================

DELIMITER //

CREATE TRIGGER UpdateAccountBalance
AFTER INSERT ON account_transaction
FOR EACH ROW
BEGIN

    IF NEW.transaction_category = 'DEPOSIT' THEN

        UPDATE bank_account
        SET account_balance = account_balance + NEW.transaction_amount
        WHERE account_id = NEW.account_id;

    ELSEIF NEW.transaction_category = 'WITHDRAW' THEN

        UPDATE bank_account
        SET account_balance = account_balance - NEW.transaction_amount
        WHERE account_id = NEW.account_id;

    END IF;

END //

DELIMITER ;


-- TEST

INSERT INTO account_transaction
(account_id, transaction_category, transaction_amount)
VALUES
(20001, 'DEPOSIT', 7000);

SELECT *
FROM bank_account
WHERE account_id = 20001;


-- ============================================================
-- 20. PREVENT INSUFFICIENT WITHDRAWAL
-- ============================================================

DELIMITER //

CREATE TRIGGER CheckWithdrawalBalance
BEFORE INSERT ON account_transaction
FOR EACH ROW
BEGIN

    DECLARE AvailableBalance DECIMAL(12,2);

    SELECT account_balance
    INTO AvailableBalance
    FROM bank_account
    WHERE account_id = NEW.account_id;

    IF NEW.transaction_category = 'WITHDRAW'
       AND NEW.transaction_amount > AvailableBalance THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
        'Withdrawal failed: Insufficient balance';

    END IF;

END //

DELIMITER ;


-- TEST

INSERT INTO account_transaction
(account_id, transaction_category, transaction_amount)
VALUES
(20001, 'WITHDRAW', 1000000);


-- ============================================================
-- 21. TRANSFER MONEY PROCEDURE
-- ============================================================

DELIMITER //

CREATE PROCEDURE TransferFunds(
    IN Sender_ID INT,
    IN Receiver_ID INT,
    IN Transfer_Value DECIMAL(12,2)
)
BEGIN

    DECLARE Sender_Balance DECIMAL(12,2);

    SELECT account_balance
    INTO Sender_Balance
    FROM bank_account
    WHERE account_id = Sender_ID;

    IF Sender_Balance < Transfer_Value THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT =
        'Transfer failed: Insufficient balance';

    ELSE

        UPDATE bank_account
        SET account_balance = account_balance - Transfer_Value
        WHERE account_id = Sender_ID;

        UPDATE bank_account
        SET account_balance = account_balance + Transfer_Value
        WHERE account_id = Receiver_ID;

    END IF;

END //

DELIMITER ;


CALL TransferFunds(20001, 20002, 6000);

SELECT *
FROM bank_account
WHERE account_id IN (20001, 20002);


-- ============================================================
-- 22. CLIENT LOAN PROCEDURE
-- ============================================================

DELIMITER //

CREATE PROCEDURE ShowClientLoans(
    IN p_Client_ID INT
)
BEGIN

    SELECT
        C.client_name,
        L.loan_id,
        L.loan_category,
        L.loan_value,
        L.interest_percent
    FROM client C
    JOIN customer_loan L
    ON C.client_id = L.client_id
    WHERE C.client_id = p_Client_ID;

END //

DELIMITER ;


CALL ShowClientLoans(201);


-- ============================================================
-- 23. HIGH BALANCE ACCOUNTS
-- ============================================================

DELIMITER //

CREATE PROCEDURE FindHighBalanceAccounts(
    IN Minimum_Balance DECIMAL(12,2)
)
BEGIN

    SELECT *
    FROM bank_account
    WHERE account_balance >= Minimum_Balance
    ORDER BY account_balance DESC;

END //

DELIMITER ;


CALL FindHighBalanceAccounts(60000);


-- ============================================================
-- 24. IN AND OUT PARAMETERS
-- ============================================================

DELIMITER //

CREATE PROCEDURE FindAccountBalance(
    IN p_Account_ID INT,
    OUT p_Current_Balance DECIMAL(12,2)
)
BEGIN

    SELECT account_balance
    INTO p_Current_Balance
    FROM bank_account
    WHERE account_id = p_Account_ID;

END //

DELIMITER ;


CALL FindAccountBalance(20001, @BalanceResult);

SELECT @BalanceResult AS Current_Balance;


-- ============================================================
-- 25. MANAGEMENT COMMANDS
-- ============================================================

SHOW TRIGGERS;

SHOW PROCEDURE STATUS
WHERE Db = 'finance_bank';


-- ============================================================
-- FINAL OUTPUT
-- ============================================================

SELECT
    C.client_id,
    C.client_name,
    A.account_id,
    A.account_category,
    A.account_balance,
    A.branch_name
FROM client C
JOIN bank_account A
ON C.client_id = A.client_id
ORDER BY C.client_id;