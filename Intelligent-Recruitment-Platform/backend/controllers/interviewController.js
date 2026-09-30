const db = require("../config/db");

// ==========================================
// SCHEDULE INTERVIEW - RECRUITER ONLY
// ==========================================
const scheduleInterview = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            application_id,
            interview_type,
            scheduled_at,
            duration_minutes,
            meeting_link,
            location,
            interviewer_name,
            notes
        } = req.body;

        if (
            !application_id ||
            !interview_type ||
            !scheduled_at
        ) {
            return res.status(400).json({
                message: "Application ID, interview type and scheduled time are required"
            });
        }

        // Find recruiter
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

        // Check application belongs to recruiter's job
        const [applications] = await db.promise().query(
            `SELECT
                a.application_id,
                a.candidate_id,
                a.status,
                cp.user_id AS candidate_user_id,
                j.title AS job_title
             FROM applications a
             INNER JOIN jobs j
                 ON a.job_id = j.job_id
             INNER JOIN candidate_profiles cp
                 ON a.candidate_id = cp.candidate_id
             WHERE a.application_id = ?
             AND j.recruiter_id = ?`,
            [application_id, recruiterId]
        );

        if (applications.length === 0) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        // Create interview
        const [result] = await db.promise().query(
            `INSERT INTO interviews
            (
                application_id,
                interview_type,
                scheduled_at,
                duration_minutes,
                meeting_link,
                location,
                interviewer_name,
                status,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 'scheduled', ?)`,
            [
                application_id,
                interview_type,
                scheduled_at,
                duration_minutes || 30,
                meeting_link || null,
                location || null,
                interviewer_name || null,
                notes || null
            ]
        );

        // Update application status
        await db.promise().query(
            `UPDATE applications
             SET status = 'interview'
             WHERE application_id = ?`,
            [application_id]
        );

        // Add status history
        await db.promise().query(
            `INSERT INTO application_status_history
            (
                application_id,
                old_status,
                new_status,
                changed_by,
                note
            )
            VALUES (?, ?, 'interview', ?, ?)`,
            [
                application_id,
                applications[0].status,
                userId,
                "Interview scheduled"
            ]
        );

        // Send interview notification to candidate
        await db.promise().query(
            `INSERT INTO notifications
             (user_id, title, message, type)
             VALUES (?, ?, ?, 'interview')`,
            [
                applications[0].candidate_user_id,
                "Interview Scheduled",
                `Your interview for ${applications[0].job_title} has been scheduled successfully.`
            ]
        );

        res.status(201).json({
            message: "Interview scheduled successfully",
            interview_id: result.insertId
        });

    } catch (error) {
        console.error("Schedule interview error:", error);

        res.status(500).json({
            message: "Failed to schedule interview",
            error: error.message
        });
    }
};


// ==========================================
// GET CANDIDATE INTERVIEWS
// ==========================================
const getCandidateInterviews = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [interviews] = await db.promise().query(
            `SELECT
                i.interview_id,
                i.application_id,
                i.interview_type,
                i.scheduled_at,
                i.duration_minutes,
                i.meeting_link,
                i.location,
                i.interviewer_name,
                i.status,
                i.notes,
                j.title AS job_title,
                rp.company_name
             FROM interviews i
             INNER JOIN applications a
                 ON i.application_id = a.application_id
             INNER JOIN candidate_profiles cp
                 ON a.candidate_id = cp.candidate_id
             INNER JOIN jobs j
                 ON a.job_id = j.job_id
             INNER JOIN recruiter_profiles rp
                 ON j.recruiter_id = rp.recruiter_id
             WHERE cp.user_id = ?
             ORDER BY i.scheduled_at ASC`,
            [userId]
        );

        res.status(200).json({
            message: "Candidate interviews retrieved successfully",
            count: interviews.length,
            interviews: interviews
        });

    } catch (error) {
        console.error("Get candidate interviews error:", error);

        res.status(500).json({
            message: "Failed to retrieve candidate interviews",
            error: error.message
        });
    }
};


// ==========================================
// GET RECRUITER INTERVIEWS
// ==========================================
const getRecruiterInterviews = async (req, res) => {
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

        const [interviews] = await db.promise().query(
            `SELECT
                i.interview_id,
                i.application_id,
                i.interview_type,
                i.scheduled_at,
                i.duration_minutes,
                i.meeting_link,
                i.location,
                i.interviewer_name,
                i.status,
                i.notes,
                j.title AS job_title,
                u.full_name AS candidate_name,
                u.email AS candidate_email
             FROM interviews i
             INNER JOIN applications a
                 ON i.application_id = a.application_id
             INNER JOIN jobs j
                 ON a.job_id = j.job_id
             INNER JOIN candidate_profiles cp
                 ON a.candidate_id = cp.candidate_id
             INNER JOIN users u
                 ON cp.user_id = u.user_id
             WHERE j.recruiter_id = ?
             ORDER BY i.scheduled_at ASC`,
            [recruiterId]
        );

        res.status(200).json({
            message: "Recruiter interviews retrieved successfully",
            count: interviews.length,
            interviews: interviews
        });

    } catch (error) {
        console.error("Get recruiter interviews error:", error);

        res.status(500).json({
            message: "Failed to retrieve recruiter interviews",
            error: error.message
        });
    }
};


// ==========================================
// UPDATE INTERVIEW STATUS
// ==========================================
const updateInterviewStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { status, notes } = req.body;

        const allowedStatuses = [
            "scheduled",
            "completed",
            "cancelled",
            "rescheduled"
        ];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid interview status"
            });
        }

        // Check recruiter ownership
        const [interviews] = await db.promise().query(
            `SELECT i.interview_id
             FROM interviews i
             INNER JOIN applications a
                 ON i.application_id = a.application_id
             INNER JOIN jobs j
                 ON a.job_id = j.job_id
             INNER JOIN recruiter_profiles rp
                 ON j.recruiter_id = rp.recruiter_id
             WHERE i.interview_id = ?
             AND rp.user_id = ?`,
            [id, userId]
        );

        if (interviews.length === 0) {
            return res.status(404).json({
                message: "Interview not found"
            });
        }

        await db.promise().query(
            `UPDATE interviews
             SET status = ?,
                 notes = ?
             WHERE interview_id = ?`,
            [
                status,
                notes || null,
                id
            ]
        );

        res.status(200).json({
            message: "Interview status updated successfully"
        });

    } catch (error) {
        console.error("Update interview status error:", error);

        res.status(500).json({
            message: "Failed to update interview status",
            error: error.message
        });
    }
};


module.exports = {
    scheduleInterview,
    getCandidateInterviews,
    getRecruiterInterviews,
    updateInterviewStatus
};