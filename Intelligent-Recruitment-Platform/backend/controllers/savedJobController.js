const db = require("../config/db");

// ==========================================
// SAVE A JOB - CANDIDATE ONLY
// ==========================================
const saveJob = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { job_id } = req.body;

        if (!job_id) {
            return res.status(400).json({
                message: "Job ID is required"
            });
        }

        // Find candidate profile
        const [candidates] = await db.promise().query(
            `SELECT candidate_id
             FROM candidate_profiles
             WHERE user_id = ?`,
            [userId]
        );

        if (candidates.length === 0) {
            return res.status(404).json({
                message: "Candidate profile not found"
            });
        }

        const candidateId = candidates[0].candidate_id;

        // Check whether job exists
        const [jobs] = await db.promise().query(
            `SELECT job_id
             FROM jobs
             WHERE job_id = ?
             AND status = 'published'`,
            [job_id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Job not found or unavailable"
            });
        }

        // Check if already saved
        const [existing] = await db.promise().query(
            `SELECT candidate_id
             FROM saved_jobs
             WHERE candidate_id = ?
             AND job_id = ?`,
            [candidateId, job_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Job is already saved"
            });
        }

        // Save job
        await db.promise().query(
            `INSERT INTO saved_jobs
             (candidate_id, job_id)
             VALUES (?, ?)`,
            [candidateId, job_id]
        );

        res.status(201).json({
            message: "Job saved successfully"
        });

    } catch (error) {
        console.error("Save job error:", error);

        res.status(500).json({
            message: "Failed to save job",
            error: error.message
        });
    }
};


// ==========================================
// GET SAVED JOBS - CANDIDATE ONLY
// ==========================================
const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find candidate profile
        const [candidates] = await db.promise().query(
            `SELECT candidate_id
             FROM candidate_profiles
             WHERE user_id = ?`,
            [userId]
        );

        if (candidates.length === 0) {
            return res.status(404).json({
                message: "Candidate profile not found"
            });
        }

        const candidateId = candidates[0].candidate_id;

        const [savedJobs] = await db.promise().query(
            `SELECT
                sj.job_id,
                sj.saved_at,
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
                rp.company_name,
                rp.company_logo
             FROM saved_jobs sj
             INNER JOIN jobs j
                 ON sj.job_id = j.job_id
             INNER JOIN recruiter_profiles rp
                 ON j.recruiter_id = rp.recruiter_id
             WHERE sj.candidate_id = ?
             ORDER BY sj.saved_at DESC`,
            [candidateId]
        );

        res.status(200).json({
            message: "Saved jobs retrieved successfully",
            count: savedJobs.length,
            jobs: savedJobs
        });

    } catch (error) {
        console.error("Get saved jobs error:", error);

        res.status(500).json({
            message: "Failed to retrieve saved jobs",
            error: error.message
        });
    }
};


// ==========================================
// REMOVE SAVED JOB - CANDIDATE ONLY
// ==========================================
const removeSavedJob = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { job_id } = req.params;

        // Find candidate profile
        const [candidates] = await db.promise().query(
            `SELECT candidate_id
             FROM candidate_profiles
             WHERE user_id = ?`,
            [userId]
        );

        if (candidates.length === 0) {
            return res.status(404).json({
                message: "Candidate profile not found"
            });
        }

        const candidateId = candidates[0].candidate_id;

        // Remove saved job
        const [result] = await db.promise().query(
            `DELETE FROM saved_jobs
             WHERE candidate_id = ?
             AND job_id = ?`,
            [candidateId, job_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Saved job not found"
            });
        }

        res.status(200).json({
            message: "Job removed from saved jobs"
        });

    } catch (error) {
        console.error("Remove saved job error:", error);

        res.status(500).json({
            message: "Failed to remove saved job",
            error: error.message
        });
    }
};


module.exports = {
    saveJob,
    getSavedJobs,
    removeSavedJob
};