
-- ---------------------------------------------------------------------
-- STEP 1 : CREATE DATABASE
-- ---------------------------------------------------------------------
CREATE DATABASE libraryhub_db;
USE libraryhub_db;


-- ---------------------------------------------------------------------
-- STEP 2 : CREATE BOOKS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE LibraryBooks (
    book_code INT PRIMARY KEY,
    book_name VARCHAR(100) NOT NULL,
    book_isbn VARCHAR(20) UNIQUE,
    release_year INT CHECK (release_year < 2027)
);


-- ---------------------------------------------------------------------
-- STEP 3 & 4 : INSERT BOOKS
-- ---------------------------------------------------------------------
INSERT INTO LibraryBooks
(book_code, book_name, book_isbn, release_year)
VALUES
(11, 'Pride and Prejudice', '9780141439518', 1813),
(12, 'The Alchemist',       '9780061122415', 1988),
(13, 'The Hobbit',          '9780547928227', 1937);

SELECT * FROM LibraryBooks;


-- ---------------------------------------------------------------------
-- STEP 5 & 6 : CREATE MEMBERS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE LibraryMembers (
    user_code INT PRIMARY KEY,
    member_name VARCHAR(100),
    member_email VARCHAR(100) UNIQUE
);


-- ---------------------------------------------------------------------
-- STEP 7 : INSERT MEMBERS
-- ---------------------------------------------------------------------
INSERT INTO LibraryMembers
(user_code, member_name, member_email)
VALUES
(201, 'Arjun Rao',   'arjun.rao@email.com'),
(202, 'Priya Shah',  'priya.shah@email.com'),
(203, 'Rahul Mehta', 'rahul.mehta@email.com');

SELECT * FROM LibraryMembers;


-- ---------------------------------------------------------------------
-- STEP 8 : CREATE BORROWINGS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE Borrowings (
    borrowing_id INT PRIMARY KEY,
    user_code INT,
    book_code INT,
    borrowing_date DATE,

    FOREIGN KEY (user_code)
        REFERENCES LibraryMembers(user_code),

    FOREIGN KEY (book_code)
        REFERENCES LibraryBooks(book_code)
);


-- ---------------------------------------------------------------------
-- STEP 9 & 10 : INSERT BORROWING RECORDS
-- ---------------------------------------------------------------------
INSERT INTO Borrowings
(borrowing_id, user_code, book_code, borrowing_date)
VALUES
(101, 201, 11, '2025-01-12'),
(102, 202, 12, '2025-01-18'),
(103, 203, 13, '2025-01-25'),
(104, 201, 12, '2025-02-04'),
(105, 202, 11, '2025-02-10'),
(106, 203, 12, '2025-02-15'),
(107, 201, 13, '2025-03-03'),
(108, 202, 13, '2025-03-09'),
(109, 203, 11, '2025-03-18'),
(110, 201, 11, '2025-04-05');

SELECT * FROM Borrowings;


-- ---------------------------------------------------------------------
-- STEP 11 : JOIN QUERY
-- ---------------------------------------------------------------------
SELECT
    lm.member_name AS Member_Name,
    lb.book_name AS Book_Name
FROM Borrowings br
INNER JOIN LibraryMembers lm
    ON br.user_code = lm.user_code
INNER JOIN LibraryBooks lb
    ON br.book_code = lb.book_code;


-- ---------------------------------------------------------------------
-- STEP 12 : GROUP BY QUERY
-- ---------------------------------------------------------------------
SELECT
    release_year,
    COUNT(book_code) AS Total_Books
FROM LibraryBooks
GROUP BY release_year
ORDER BY release_year;


-- ---------------------------------------------------------------------
-- STEP 13 : CREATE DONATION HISTORY TABLE
-- ---------------------------------------------------------------------
CREATE TABLE BookDonations (
    donation_code INT PRIMARY KEY,
    book_code INT,
    contributor_name VARCHAR(100),
    donation_date DATE,

    FOREIGN KEY (book_code)
        REFERENCES LibraryBooks(book_code)
);


-- ---------------------------------------------------------------------
-- STEP 14-16 : BOOK DONATION TRANSACTION
-- ---------------------------------------------------------------------
START TRANSACTION;

INSERT INTO LibraryBooks
(book_code, book_name, book_isbn, release_year)
VALUES
(14, 'The Kite Runner', '9781594631931', 2003);

INSERT INTO BookDonations
(donation_code, book_code, contributor_name, donation_date)
VALUES
(501, 14, 'Sneha Reddy', CURDATE());

COMMIT;


-- ---------------------------------------------------------------------
-- STEP 17 : CREATE INDEX
-- ---------------------------------------------------------------------
CREATE INDEX idx_library_isbn
ON LibraryBooks(book_isbn);


-- ---------------------------------------------------------------------
-- STEP 18 : FAST ISBN SEARCH
-- ---------------------------------------------------------------------
SELECT *
FROM LibraryBooks
WHERE book_isbn = '9780061122415';


-- =====================================================================
-- FINAL QUERY
-- Shows the complete final library borrowing information
-- =====================================================================

SELECT
    br.borrowing_id AS Borrowing_ID,
    lm.member_name AS Member_Name,
    lm.member_email AS Email,
    lb.book_name AS Book_Name,
    lb.book_isbn AS ISBN,
    lb.release_year AS Published_Year,
    br.borrowing_date AS Borrowing_Date
FROM Borrowings br
INNER JOIN LibraryMembers lm
    ON br.user_code = lm.user_code
INNER JOIN LibraryBooks lb
    ON br.book_code = lb.book_code
ORDER BY br.borrowing_id;

