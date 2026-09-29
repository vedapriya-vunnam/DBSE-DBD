-- =========================================================
-- WEEK 4 - JOINS AND SET OPERATIONS
-- =========================================================

-- STEP 1: DATABASE

DROP DATABASE IF EXISTS relation_db;

CREATE DATABASE IF NOT EXISTS relation_db;

USE relation_db;


-- =========================================================
-- PART 1: CROSS JOIN
-- =========================================================

-- Query 1: Create employee table

CREATE TABLE employee (
    emp_id INT,
    emp_name VARCHAR(30)
);


-- Query 2: Create employee_details table

CREATE TABLE employee_details (
    emp_id INT,
    location VARCHAR(30)
);


-- Query 3: Insert employee records

INSERT INTO employee VALUES
(1,'Rahul'),
(2,'Priya'),
(4,'Karthik');


-- Query 4: Insert employee details

INSERT INTO employee_details VALUES
(1,'HYDERABAD'),
(2,'BANGALORE'),
(3,'CHENNAI');


-- Query 5: CROSS JOIN

SELECT *
FROM employee
CROSS JOIN employee_details;


-- =========================================================
-- PART 2: INNER JOIN
-- =========================================================

-- Query 6: Add matching employee

INSERT INTO employee VALUES
(3,'Sneha');


-- Query 7: INNER JOIN

SELECT *
FROM employee
INNER JOIN employee_details
ON employee.emp_id = employee_details.emp_id;


-- Query 8: INNER JOIN - names and locations

SELECT employee.emp_name,
       employee_details.location
FROM employee
INNER JOIN employee_details
ON employee.emp_id = employee_details.emp_id;


-- =========================================================
-- PART 3: NATURAL JOIN
-- =========================================================

-- Query 9: NATURAL JOIN

SELECT *
FROM employee
NATURAL JOIN employee_details;


-- =========================================================
-- PART 4: LEFT OUTER JOIN
-- =========================================================

-- Query 10: Add unmatched employee

INSERT INTO employee VALUES
(5,'Aman');


-- Query 11: Add unmatched locations

INSERT INTO employee_details VALUES
(7,'DELHI'),
(8,'MUMBAI');


-- Query 12: LEFT JOIN

SELECT *
FROM employee
LEFT OUTER JOIN employee_details
ON employee.emp_id = employee_details.emp_id;


-- Query 13: LEFT JOIN - unmatched employees

SELECT *
FROM employee
LEFT JOIN employee_details
ON employee.emp_id = employee_details.emp_id
WHERE employee_details.emp_id IS NULL;


-- =========================================================
-- PART 5: RIGHT OUTER JOIN
-- =========================================================

-- Query 14: RIGHT JOIN

SELECT *
FROM employee
RIGHT OUTER JOIN employee_details
ON employee.emp_id = employee_details.emp_id;


-- Query 15: RIGHT JOIN - unmatched locations

SELECT *
FROM employee
RIGHT JOIN employee_details
ON employee.emp_id = employee_details.emp_id
WHERE employee.emp_id IS NULL;


-- =========================================================
-- PART 6: FULL OUTER JOIN
-- MySQL equivalent using UNION
-- =========================================================

-- Query 16: FULL OUTER JOIN equivalent

SELECT *
FROM employee
LEFT JOIN employee_details
ON employee.emp_id = employee_details.emp_id

UNION

SELECT *
FROM employee
RIGHT JOIN employee_details
ON employee.emp_id = employee_details.emp_id;


-- Query 17: FULL OUTER JOIN - unmatched records

SELECT *
FROM employee
LEFT JOIN employee_details
ON employee.emp_id = employee_details.emp_id
WHERE employee_details.emp_id IS NULL

UNION

SELECT *
FROM employee
RIGHT JOIN employee_details
ON employee.emp_id = employee_details.emp_id
WHERE employee.emp_id IS NULL;


-- =========================================================
-- PART 7: UNION
-- =========================================================

-- Query 18: Create first employee group

CREATE TABLE team_one (
    emp_id INT,
    emp_name VARCHAR(30)
);


-- Query 19: Create second employee group

CREATE TABLE team_two (
    emp_id INT,
    emp_name VARCHAR(30)
);


-- Query 20: Insert first group records

INSERT INTO team_one VALUES
(1,'Rahul'),
(2,'Priya');


-- Query 21: Insert second group records

INSERT INTO team_two VALUES
(2,'Priya'),
(3,'Rohan');


-- Query 22: UNION

SELECT *
FROM team_one
UNION
SELECT *
FROM team_two;


-- Query 23: UNION - names

SELECT emp_name
FROM team_one
UNION
SELECT emp_name
FROM team_two;


-- =========================================================
-- PART 8: UNION ALL
-- =========================================================

-- Query 24: UNION ALL

SELECT *
FROM team_one
UNION ALL
SELECT *
FROM team_two;


-- Query 25: UNION ALL - COUNT

SELECT COUNT(*) AS Total_Records
FROM
(
    SELECT * FROM team_one
    UNION ALL
    SELECT * FROM team_two
) AS combined_data;


-- =========================================================
-- PART 9: INTERSECT
-- MySQL-compatible equivalent
-- =========================================================

-- Query 26: INTERSECT equivalent

SELECT t1.*
FROM team_one t1
INNER JOIN team_two t2
ON t1.emp_id = t2.emp_id
AND t1.emp_name = t2.emp_name;


-- Query 27: INTERSECT - names

SELECT DISTINCT t1.emp_name
FROM team_one t1
INNER JOIN team_two t2
ON t1.emp_name = t2.emp_name;


-- =========================================================
-- PART 10: MINUS
-- MySQL-compatible equivalent
-- =========================================================

-- Query 28: MINUS equivalent

SELECT *
FROM team_one t1
WHERE NOT EXISTS (
    SELECT 1
    FROM team_two t2
    WHERE t2.emp_id = t1.emp_id
    AND t2.emp_name = t1.emp_name
);


-- Query 29: MINUS - names

SELECT emp_name
FROM team_one
WHERE emp_name NOT IN (
    SELECT emp_name
    FROM team_two
);


-- =========================================================
-- PART 11: ADVANCED QUESTIONS
-- =========================================================

-- Query 30: Matching employee locations

SELECT e.emp_id,
       e.emp_name,
       ed.location
FROM employee e
INNER JOIN employee_details ed
ON e.emp_id = ed.emp_id;


-- Query 31: Location availability status

SELECT e.emp_id,
       e.emp_name,
       CASE
           WHEN ed.location IS NULL
           THEN 'Location Missing'
           ELSE 'Location Available'
       END AS Location_Status
FROM employee e
LEFT JOIN employee_details ed
ON e.emp_id = ed.emp_id;


-- =========================================================
-- FINAL OUTPUT
-- =========================================================

-- Query 32: Display all employees and their locations

SELECT
    e.emp_id,
    e.emp_name,
    ed.location,
    CASE
        WHEN ed.location IS NULL
        THEN 'Location Missing'
        ELSE 'Location Available'
    END AS Location_Status
FROM employee e
LEFT JOIN employee_details ed
ON e.emp_id = ed.emp_id;