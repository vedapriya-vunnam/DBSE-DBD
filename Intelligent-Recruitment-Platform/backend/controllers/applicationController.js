const db = require("../config/db");

// ===============================
// APPLY FOR A JOB
// ===============================
const applyForJob = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { job_id, cover_letter } = req.body;

        if (!job_id) {
            return res.status(400).json({
                message: "Job ID is required"
            });
        }

        // Get candidate ID
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

        // Check job and get recruiter
        const [jobs] = await db.promise().query(
            `SELECT j.job_id, j.title,
                    rp.user_id AS recruiter_user_id
             FROM jobs j
             INNER JOIN recruiter_profiles rp
                ON j.recruiter_id = rp.recruiter_id
             WHERE j.job_id = ?
             AND j.status = 'published'`,
            [job_id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Job not found or not available"
            });
        }

        const job = jobs[0];

        // Check duplicate application
        const [existing] = await db.promise().query(
            `SELECT application_id
             FROM applications
             WHERE job_id = ?
             AND candidate_id = ?`,
            [job_id, candidateId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "You have already applied for this job"
            });
        }

        // Insert application
        const [result] = await db.promise().query(
            `INSERT INTO applications
             (job_id, candidate_id, cover_letter, status)
             VALUES (?, ?, ?, 'applied')`,
            [job_id, candidateId, cover_letter || null]
        );

        // Notify recruiter
        await db.promise().query(
            `INSERT INTO notifications
             (user_id, title, message, type)
             VALUES (?, ?, ?, 'application')`,
            [
                job.recruiter_user_id,
                "New Job Application",
                `A candidate has applied for your job: ${job.title}`
            ]
        );

        res.status(201).json({
            message: "Application submitted successfully",
            application_id: result.insertId
        });

    } catch (error) {
        console.error("Apply job error:", error);

        res.status(500).json({
            message: "Failed to submit application",
            error: error.message
        });
    }
};


// ===============================
// GET CANDIDATE APPLICATIONS
// ===============================
const getCandidateApplications = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [applications] = await db.promise().query(
            `SELECT
                a.application_id,
                a.job_id,
                a.cover_letter,
                a.status,
                a.applied_at,
                a.updated_at,
                j.title,
                j.location,
                j.employment_type,
                j.work_mode,
                rp.company_name
             FROM applications a
             INNER JOIN candidate_profiles cp
                ON a.candidate_id = cp.candidate_id
             INNER JOIN jobs j
                ON a.job_id = j.job_id
             INNER JOIN recruiter_profiles rp
                ON j.recruiter_id = rp.recruiter_id
             WHERE cp.user_id = ?
             ORDER BY a.applied_at DESC`,
            [userId]
        );

        res.status(200).json({
            message: "Candidate applications retrieved successfully",
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error("Get candidate applications error:", error);

        res.status(500).json({
            message: "Failed to retrieve applications",
            error: error.message
        });
    }
};


// ===============================
// GET RECRUITER APPLICATIONS
// ===============================
const getRecruiterApplications = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get recruiter ID
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

        const [applications] = await db.promise().query(
            `SELECT
                a.application_id,
                a.job_id,
                a.candidate_id,
                a.cover_letter,
                a.status,
                a.applied_at,
                a.updated_at,
                j.title AS job_title,
                u.full_name AS candidate_name,
                u.email AS candidate_email,
                u.phone AS candidate_phone,
                cp.headline,
                cp.location,
                cp.education,
                cp.experience_years,
                cp.resume_url,
                cp.linkedin_url,
                cp.github_url,
                cp.portfolio_url
             FROM applications a
             INNER JOIN jobs j
                ON a.job_id = j.job_id
             INNER JOIN candidate_profiles cp
                ON a.candidate_id = cp.candidate_id
             INNER JOIN users u
                ON cp.user_id = u.user_id
             WHERE j.recruiter_id = ?
             ORDER BY a.applied_at DESC`,
            [recruiterId]
        );

        res.status(200).json({
            message: "Recruiter applications retrieved successfully",
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error("Get recruiter applications error:", error);

        res.status(500).json({
            message: "Failed to retrieve applications",
            error: error.message
        });
    }
};


// ===============================
// UPDATE APPLICATION STATUS
// ===============================
const updateApplicationStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { status, note } = req.body;

        const allowedStatuses = [
            "applied",
            "under_review",
            "shortlisted",
            "interview",
            "selected",
            "rejected",
            "withdrawn"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        // Get recruiter ID
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

        // Get application and candidate
        const [applications] = await db.promise().query(
            `SELECT
                a.application_id,
                a.status AS old_status,
                a.candidate_id,
                cp.user_id AS candidate_user_id,
                j.title AS job_title
             FROM applications a
             INNER JOIN jobs j
                ON a.job_id = j.job_id
             INNER JOIN candidate_profiles cp
                ON a.candidate_id = cp.candidate_id
             WHERE a.application_id = ?
             AND j.recruiter_id = ?`,
            [id, recruiterId]
        );

        if (applications.length === 0) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        const application = applications[0];

        // Update status
        await db.promise().query(
            `UPDATE applications
             SET status = ?
             WHERE application_id = ?`,
            [status, id]
        );

        // Save status history
        await db.promise().query(
            `INSERT INTO application_status_history
             (application_id, old_status, new_status, changed_by, note)
             VALUES (?, ?, ?, ?, ?)`,
            [
                id,
                application.old_status,
                status,
                userId,
                note || null
            ]
        );

        // Notify candidate
        await db.promise().query(
            `INSERT INTO notifications
             (user_id, title, message, type)
             VALUES (?, ?, ?, 'application')`,
            [
                application.candidate_user_id,
                "Application Status Updated",
                `Your application for ${application.job_title} is now ${status.replace("_", " ")}.`
            ]
        );

        res.status(200).json({
            message: "Application status updated successfully"
        });

    } catch (error) {
        console.error("Update application status error:", error);

        res.status(500).json({
            message: "Failed to update application status",
            error: error.message
        });
    }
};


module.exports = {
    applyForJob,
    getCandidateApplications,
    getRecruiterApplications,
    updateApplicationStatus
};