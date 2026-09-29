DROP DATABASE IF EXISTS bookflow_db;
-- Query 1: Create the database
CREATE DATABASE IF NOT EXISTS bookflow_db;

-- Query 2: Select the database
USE bookflow_db;

-- Query 3: Create the books table
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) NOT NULL UNIQUE,
    published_year INT,
    CONSTRAINT chk_published_year CHECK (published_year < 2027)
);

-- Query 4: Create the members table
CREATE TABLE members (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE
);

-- Query 5: Inspect the table structures
DESCRIBE books;
DESCRIBE members;

-- Query 6: Insert 3 books
INSERT INTO books (title, isbn, published_year) VALUES
('Ikigai', '9780143452744', 2017),
('Rich Dad Poor Dad', '9781612680194', 1997),
('The Psychology of Money', '9780857197689', 2020);

-- Query 7: Insert 3 members
INSERT INTO members (full_name, email) VALUES
('Arjun Reddy', 'arjun.reddy@example.com'),
('Sneha Patel', 'sneha.patel@example.com'),
('Kiran Rao', 'kiran.rao@example.com');

-- Display books
SELECT * FROM books;

-- Display members
SELECT * FROM members;

-- Test 1: Duplicate ISBN
INSERT INTO books (title, isbn, published_year)
VALUES ('Another Book', '9780143452744', 2020);

-- Test 2: NULL title
INSERT INTO books (title, isbn, published_year)
VALUES (NULL, '9999999999999', 2015);

-- Test 3: Future publication year
INSERT INTO books (title, isbn, published_year)
VALUES ('Future World', '8888888888888', 2030);

-- Test 4: Duplicate email
INSERT INTO members (full_name, email)
VALUES ('Arjun Duplicate', 'arjun.reddy@example.com');