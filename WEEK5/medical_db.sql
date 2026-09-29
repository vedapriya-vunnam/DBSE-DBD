-- =========================================================
-- WEEK 5 - DOCTOR & DEPARTMENT
-- =========================================================

-- STEP 1: DATABASE

DROP DATABASE IF EXISTS medical_db;

CREATE DATABASE IF NOT EXISTS medical_db;

USE medical_db;


-- =========================================================
-- STEP 2: CREATE DOCTOR TABLE
-- =========================================================

-- Query 1: Create doctor table

CREATE TABLE doctor (
    doctor_id INT PRIMARY KEY,
    doctor_name VARCHAR(100),
    specialization VARCHAR(100),
    license_no VARCHAR(20)
);


-- =========================================================
-- STEP 3: INSERT DATA INTO DOCTOR
-- =========================================================

-- Query 2: Insert doctor records

INSERT INTO doctor VALUES
(101,'David Miller','General Physician','LIC1001'),
(102,'Emma Wilson','Cardiologist','LIC1002'),
(103,'Robert Smith','Surgical Specialist','LIC1003'),
(104,'Michael Brown','Senior Physician','LIC1004'),
(105,'Daniel Taylor','Chief Physician','LIC1005'),
(106,'James Anderson','Surgical Specialist','LIC1006'),
(107,'William Thomas','Surgical Specialist','LIC1007'),
(108,'Joseph Martin','Resident Doctor','LIC1008'),
(109,'Sophia Clark','Psychiatrist','LIC1009');


-- Query 3: Display all doctors

SELECT *
FROM doctor;


-- =========================================================
-- STEP 4: CREATE DEPARTMENT TABLE
-- =========================================================

-- Query 4: Create department table

CREATE TABLE medical_department (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100),
    department_head INT
);


-- =========================================================
-- STEP 5: INSERT DATA INTO DEPARTMENT
-- =========================================================

-- Query 5: Insert department records

INSERT INTO medical_department VALUES
(1,'General Medicine',104),
(2,'Surgery',107),
(3,'Psychiatry',109);


-- Query 6: Display all departments

SELECT *
FROM medical_department;


-- =========================================================
-- QUESTIONS
-- =========================================================


-- Query 7: INNER JOIN

SELECT md.department_name AS Department,
       d.doctor_name AS Department_Head
FROM medical_department md
JOIN doctor d
ON md.department_head = d.doctor_id;


-- Query 8: WHERE

SELECT *
FROM doctor
WHERE specialization = 'Surgical Specialist';


-- Query 9: WHERE + LIKE

SELECT *
FROM doctor
WHERE doctor_name LIKE 'David%';


-- Query 10: COUNT()

SELECT COUNT(*) AS Total_Doctors
FROM doctor;


-- Query 11: COUNT DISTINCT

SELECT COUNT(DISTINCT specialization) AS Unique_Specializations
FROM doctor;


-- Query 12: GROUP BY

SELECT specialization,
       COUNT(*) AS Total_Doctors
FROM doctor
GROUP BY specialization;


-- Query 13: GROUP BY + HAVING

SELECT specialization,
       COUNT(*) AS Total_Doctors
FROM doctor
GROUP BY specialization
HAVING COUNT(*) > 1;


-- Query 14: ORDER BY ASC

SELECT *
FROM doctor
ORDER BY doctor_name ASC;


-- Query 15: ORDER BY DESC

SELECT *
FROM doctor
ORDER BY doctor_id DESC;


-- Query 16: WHERE + IN

SELECT *
FROM doctor
WHERE doctor_id IN
(
    SELECT department_head
    FROM medical_department
);


-- Query 17: SUBQUERY - Doctors who are not department heads

SELECT *
FROM doctor
WHERE doctor_id NOT IN
(
    SELECT department_head
    FROM medical_department
);


-- Query 18: GROUP BY + ORDER BY

SELECT specialization,
       COUNT(*) AS Total_Doctors
FROM doctor
GROUP BY specialization
ORDER BY Total_Doctors DESC;


-- Query 19: WHERE + LIKE

SELECT *
FROM doctor
WHERE specialization LIKE '%Specialist%';


-- Query 20: JOIN + WHERE

SELECT d.doctor_name
FROM doctor d
JOIN medical_department md
ON d.doctor_id = md.department_head
WHERE md.department_name = 'Surgery';


-- Query 21: JOIN + ORDER BY

SELECT md.department_name AS Department,
       d.doctor_name AS Department_Head
FROM medical_department md
JOIN doctor d
ON md.department_head = d.doctor_id
ORDER BY md.department_name;


-- Query 22: WHERE + NOT LIKE

SELECT *
FROM doctor
WHERE specialization NOT LIKE '%Surgical%';


-- Query 23: COUNT + HAVING

SELECT specialization,
       COUNT(*) AS Total
FROM doctor
GROUP BY specialization
HAVING COUNT(*) >= 2;


-- Query 24: EXISTS

SELECT *
FROM medical_department md
WHERE EXISTS
(
    SELECT 1
    FROM doctor d
    WHERE d.doctor_id = md.department_head
);


-- Query 25: MAX()

SELECT MAX(doctor_id) AS Highest_Doctor_ID
FROM doctor;


-- Query 26: MIN()

SELECT MIN(doctor_id) AS Lowest_Doctor_ID
FROM doctor;


-- =========================================================
-- FINAL OUTPUT
-- =========================================================

-- Query 27: Display departments with their heads

SELECT
    md.department_id,
    md.department_name,
    d.doctor_id,
    d.doctor_name,
    d.specialization
FROM medical_department md
INNER JOIN doctor d
ON md.department_head = d.doctor_id
ORDER BY md.department_id;