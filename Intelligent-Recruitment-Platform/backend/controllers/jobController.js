const db = require("../config/db");

// =====================================
// CREATE JOB
// =====================================
const createJob = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            title,
            description,
            employment_type,
            work_mode,
            location,
            salary_min,
            salary_max,
            salary_currency,
            experience_min,
            experience_max,
            openings,
            application_deadline
        } = req.body;

        if (
            !title ||
            !description ||
            !employment_type ||
            !work_mode ||
            !location ||
            !application_deadline
        ) {
            return res.status(400).json({
                message: "Please provide all required job details"
            });
        }

        const [recruiters] = await db.promise().query(
            `SELECT recruiter_id
             FROM recruiter_profiles
             WHERE user_id = ?`,
            [userId]
        );

        if (recruiters.length === 0) {
            return res.status(404).json({
                message: "Recruiter profile not found"
            });
        }

        const recruiterId = recruiters[0].recruiter_id;

        const [result] = await db.promise().query(
            `INSERT INTO jobs
            (
                recruiter_id,
                title,
                description,
                employment_type,
                work_mode,
                location,
                salary_min,
                salary_max,
                salary_currency,
                experience_min,
                experience_max,
                openings,
                status,
                application_deadline
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)`,
            [
                recruiterId,
                title,
                description,
                employment_type,
                work_mode,
                location,
                salary_min || null,
                salary_max || null,
                salary_currency || "INR",
                experience_min || 0,
                experience_max || 0,
                openings || 1,
                application_deadline
            ]
        );

        res.status(201).json({
            message: "Job created successfully",
            job_id: result.insertId
        });

    } catch (error) {
        console.error("Create job error:", error);

        res.status(500).json({
            message: "Failed to create job",
            error: error.message
        });
    }
};


// =====================================
// GET ALL PUBLISHED JOBS
// =====================================
const getAllJobs = async (req, res) => {
    try {
        const [jobs] = await db.promise().query(
            `SELECT
                j.job_id,
                j.title,
                j.description,
                j.employment_type,
                j.work_mode,
                j.location,
                j.salary_min,
                j.salary_max,
                j.salary_currency,
                j.experience_min,
                j.experience_max,
                j.openings,
                j.application_deadline,
                j.created_at,
                rp.company_name,
                rp.company_logo
             FROM jobs j
             INNER JOIN recruiter_profiles rp
                ON j.recruiter_id = rp.recruiter_id
             WHERE j.status = 'published'
             ORDER BY j.created_at DESC`
        );

        res.status(200).json({
            message: "Jobs retrieved successfully",
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error("Get jobs error:", error);

        res.status(500).json({
            message: "Failed to retrieve jobs",
            error: error.message
        });
    }
};


// =====================================
// SEARCH & FILTER JOBS
// =====================================
const searchJobs = async (req, res) => {
    try {

        const {
            keyword,
            location,
            employment_type,
            work_mode,
            min_salary,
            max_salary,
            min_experience,
            max_experience,
            skill,
            sort
        } = req.query;

        let query = `
            SELECT DISTINCT
                j.job_id,
                j.title,
                j.description,
                j.employment_type,
                j.work_mode,
                j.location,
                j.salary_min,
                j.salary_max,
                j.salary_currency,
                j.experience_min,
                j.experience_max,
                j.openings,
                j.application_deadline,
                j.created_at,
                rp.company_name,
                rp.company_logo
            FROM jobs j
            INNER JOIN recruiter_profiles rp
                ON j.recruiter_id = rp.recruiter_id
        `;

        const conditions = [
            `j.status = 'published'`
        ];

        const values = [];

        // ---------------------------------
        // KEYWORD SEARCH
        // ---------------------------------
        if (keyword) {
            conditions.push(`
                (
                    j.title LIKE ?
                    OR j.description LIKE ?
                    OR rp.company_name LIKE ?
                )
            `);

            const keywordValue = `%${keyword}%`;

            values.push(
                keywordValue,
                keywordValue,
                keywordValue
            );
        }

        // ---------------------------------
        // LOCATION
        // ---------------------------------
        if (location) {
            conditions.push(`
                j.location LIKE ?
            `);

            values.push(`%${location}%`);
        }

        // ---------------------------------
        // EMPLOYMENT TYPE
        // ---------------------------------
        if (employment_type) {

            const allowedTypes = [
                "full_time",
                "part_time",
                "internship",
                "contract"
            ];

            if (!allowedTypes.includes(employment_type)) {
                return res.status(400).json({
                    message: "Invalid employment type"
                });
            }

            conditions.push(`j.employment_type = ?`);
            values.push(employment_type);
        }

        // ---------------------------------
        // WORK MODE
        // ---------------------------------
        if (work_mode) {

            const allowedModes = [
                "onsite",
                "remote",
                "hybrid"
            ];

            if (!allowedModes.includes(work_mode)) {
                return res.status(400).json({
                    message: "Invalid work mode"
                });
            }

            conditions.push(`j.work_mode = ?`);
            values.push(work_mode);
        }

        // ---------------------------------
        // MINIMUM SALARY
        // Job salary_max must be >= requested
        // ---------------------------------
        if (min_salary) {

            const salary = Number(min_salary);

            if (Number.isNaN(salary)) {
                return res.status(400).json({
                    message: "Invalid minimum salary"
                });
            }

            conditions.push(`
                (
                    j.salary_max IS NULL
                    OR j.salary_max >= ?
                )
            `);

            values.push(salary);
        }

        // ---------------------------------
        // MAXIMUM SALARY
        // Job salary_min must be <= requested
        // ---------------------------------
        if (max_salary) {

            const salary = Number(max_salary);

            if (Number.isNaN(salary)) {
                return res.status(400).json({
                    message: "Invalid maximum salary"
                });
            }

            conditions.push(`
                (
                    j.salary_min IS NULL
                    OR j.salary_min <= ?
                )
            `);

            values.push(salary);
        }

        // ---------------------------------
        // MINIMUM EXPERIENCE
        // ---------------------------------
        if (min_experience) {

            const experience = Number(min_experience);

            if (Number.isNaN(experience)) {
                return res.status(400).json({
                    message: "Invalid minimum experience"
                });
            }

            conditions.push(`
                j.experience_max >= ?
            `);

            values.push(experience);
        }

        // ---------------------------------
        // MAXIMUM EXPERIENCE
        // ---------------------------------
        if (max_experience) {

            const experience = Number(max_experience);

            if (Number.isNaN(experience)) {
                return res.status(400).json({
                    message: "Invalid maximum experience"
                });
            }

            conditions.push(`
                j.experience_min <= ?
            `);

            values.push(experience);
        }

        // ---------------------------------
        // SKILL FILTER
        // ---------------------------------
        if (skill) {

            query += `
                INNER JOIN job_skills js
                    ON j.job_id = js.job_id
                INNER JOIN skills s
                    ON js.skill_id = s.skill_id
            `;

            conditions.push(`
                s.skill_name LIKE ?
            `);

            values.push(`%${skill}%`);
        }

        // ---------------------------------
        // WHERE
        // ---------------------------------
        query += `
            WHERE ${conditions.join(" AND ")}
        `;

        // ---------------------------------
        // SORTING
        // ---------------------------------
        if (sort === "salary_high") {

            query += `
                ORDER BY j.salary_max DESC
            `;

        } else if (sort === "salary_low") {

            query += `
                ORDER BY j.salary_min ASC
            `;

        } else if (sort === "oldest") {

            query += `
                ORDER BY j.created_at ASC
            `;

        } else {

            // Default = newest jobs first
            query += `
                ORDER BY j.created_at DESC
            `;
        }

        const [jobs] = await db.promise().query(
            query,
            values
        );

        res.status(200).json({
            message: "Job search completed successfully",
            count: jobs.length,
            filters: {
                keyword: keyword || null,
                location: location || null,
                employment_type: employment_type || null,
                work_mode: work_mode || null,
                min_salary: min_salary || null,
                max_salary: max_salary || null,
                min_experience: min_experience || null,
                max_experience: max_experience || null,
                skill: skill || null,
                sort: sort || "newest"
            },
            jobs
        });

    } catch (error) {

        console.error("Search jobs error:", error);

        res.status(500).json({
            message: "Failed to search jobs",
            error: error.message
        });
    }
};


// =====================================
// GET SINGLE JOB
// =====================================
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        const [jobs] = await db.promise().query(
            `SELECT
                j.job_id,
                j.title,
                j.description,
                j.employment_type,
                j.work_mode,
                j.location,
                j.salary_min,
                j.salary_max,
                j.salary_currency,
                j.experience_min,
                j.experience_max,
                j.openings,
                j.application_deadline,
                j.created_at,
                rp.company_name,
                rp.company_description,
                rp.company_website,
                rp.company_location,
                rp.company_logo
             FROM jobs j
             INNER JOIN recruiter_profiles rp
                ON j.recruiter_id = rp.recruiter_id
             WHERE j.job_id = ?
             AND j.status = 'published'`,
            [id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.status(200).json({
            message: "Job retrieved successfully",
            job: jobs[0]
        });

    } catch (error) {
        console.error("Get job error:", error);

        res.status(500).json({
            message: "Failed to retrieve job",
            error: error.message
        });
    }
};


// =====================================
// GET RECRUITER JOBS
// =====================================
const getRecruiterJobs = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [recruiters] = await db.promise().query(
            `SELECT recruiter_id
             FROM recruiter_profiles
             WHERE user_id = ?`,
            [userId]
        );

        if (recruiters.length === 0) {
            return res.status(404).json({
                message: "Recruiter profile not found"
            });
        }

        const recruiterId = recruiters[0].recruiter_id;

        const [jobs] = await db.promise().query(
            `SELECT
                job_id,
                title,
                description,
                employment_type,
                work_mode,
                location,
                salary_min,
                salary_max,
                salary_currency,
                experience_min,
                experience_max,
                openings,
                status,
                application_deadline,
                created_at
             FROM jobs
             WHERE recruiter_id = ?
             ORDER BY created_at DESC`,
            [recruiterId]
        );

        res.status(200).json({
            message: "Recruiter jobs retrieved successfully",
            count: jobs.length,
            jobs
        });

    } catch (error) {
        console.error("Get recruiter jobs error:", error);

        res.status(500).json({
            message: "Failed to retrieve recruiter jobs",
            error: error.message
        });
    }
};


// =====================================
// UPDATE JOB
// =====================================
const updateJob = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const {
            title,
            description,
            employment_type,
            work_mode,
            location,
            salary_min,
            salary_max,
            salary_currency,
            experience_min,
            experience_max,
            openings,
            application_deadline
        } = req.body;

        const [recruiters] = await db.promise().query(
            `SELECT recruiter_id
             FROM recruiter_profiles
             WHERE user_id = ?`,
            [userId]
        );

        if (recruiters.length === 0) {
            return res.status(404).json({
                message: "Recruiter profile not found"
            });
        }

        const recruiterId = recruiters[0].recruiter_id;

        const [result] = await db.promise().query(
            `UPDATE jobs
             SET
                title = ?,
                description = ?,
                employment_type = ?,
                work_mode = ?,
                location = ?,
                salary_min = ?,
                salary_max = ?,
                salary_currency = ?,
                experience_min = ?,
                experience_max = ?,
                openings = ?,
                application_deadline = ?
             WHERE job_id = ?
             AND recruiter_id = ?`,
            [
                title,
                description,
                employment_type,
                work_mode,
                location,
                salary_min || null,
                salary_max || null,
                salary_currency || "INR",
                experience_min || 0,
                experience_max || 0,
                openings || 1,
                application_deadline,
                id,
                recruiterId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Job not found or you do not own this job"
            });
        }

        res.status(200).json({
            message: "Job updated successfully"
        });

    } catch (error) {
        console.error("Update job error:", error);

        res.status(500).json({
            message: "Failed to update job",
            error: error.message
        });
    }
};


// =====================================
// UPDATE JOB STATUS
// =====================================
const updateJobStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "draft",
            "published",
            "closed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid job status"
            });
        }

        const [recruiters] = await db.promise().query(
            `SELECT recruiter_id
             FROM recruiter_profiles
             WHERE user_id = ?`,
            [userId]
        );

        if (recruiters.length === 0) {
            return res.status(404).json({
                message: "Recruiter profile not found"
            });
        }

        const recruiterId = recruiters[0].recruiter_id;

        const [result] = await db.promise().query(
            `UPDATE jobs
             SET status = ?
             WHERE job_id = ?
             AND recruiter_id = ?`,
            [status, id, recruiterId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Job not found or you do not own this job"
            });
        }

        res.status(200).json({
            message: "Job status updated successfully"
        });

    } catch (error) {
        console.error("Update job status error:", error);

        res.status(500).json({
            message: "Failed to update job status",
            error: error.message
        });
    }
};


// =====================================
// DELETE JOB
// =====================================
const deleteJob = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const [recruiters] = await db.promise().query(
            `SELECT recruiter_id
             FROM recruiter_profiles
             WHERE user_id = ?`,
            [userId]
        );

        if (recruiters.length === 0) {
            return res.status(404).json({
                message: "Recruiter profile not found"
            });
        }

        const recruiterId = recruiters[0].recruiter_id;

        const [result] = await db.promise().query(
            `DELETE FROM jobs
             WHERE job_id = ?
             AND recruiter_id = ?`,
            [id, recruiterId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Job not found or you do not own this job"
            });
        }

        res.status(200).json({
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error("Delete job error:", error);

        res.status(500).json({
            message: "Failed to delete job",
            error: error.message
        });
    }
};


module.exports = {
    createJob,
    getAllJobs,
    searchJobs,
    getJobById,
    getRecruiterJobs,
    updateJob,
    updateJobStatus,
    deleteJob
};