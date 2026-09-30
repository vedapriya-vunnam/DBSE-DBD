const db = require("../config/db");

// ===============================
// CANDIDATE DASHBOARD
// ===============================
const getCandidateDashboard = async (req, res) => {
    try {
        // Get candidate profile ID
        const [candidateRows] = await db.promise().query(
            `SELECT candidate_id
             FROM candidate_profiles
             WHERE user_id = ?`,
            [req.user.userId]
        );

        if (candidateRows.length === 0) {
            return res.status(404).json({
                message: "Candidate profile not found"
            });
        }

        const candidateId = candidateRows[0].candidate_id;

        // Application statistics
        const [applicationStats] = await db.promise().query(
            `SELECT
                COUNT(*) AS total_applications,
                COALESCE(SUM(status = 'applied'), 0) AS applied,
                COALESCE(SUM(status = 'under_review'), 0) AS under_review,
                COALESCE(SUM(status = 'shortlisted'), 0) AS shortlisted,
                COALESCE(SUM(status = 'interview'), 0) AS interview,
                COALESCE(SUM(status = 'selected'), 0) AS selected,
                COALESCE(SUM(status = 'rejected'), 0) AS rejected,
                COALESCE(SUM(status = 'withdrawn'), 0) AS withdrawn
             FROM applications
             WHERE candidate_id = ?`,
            [candidateId]
        );

        // Saved jobs count
        const [savedRows] = await db.promise().query(
            `SELECT COUNT(*) AS saved_jobs
             FROM saved_jobs
             WHERE candidate_id = ?`,
            [candidateId]
        );

        // Upcoming interviews count
        const [interviewRows] = await db.promise().query(
            `SELECT COUNT(*) AS upcoming_interviews
             FROM interviews i
             JOIN applications a
                ON i.application_id = a.application_id
             WHERE a.candidate_id = ?
             AND i.status IN ('scheduled', 'rescheduled')
             AND i.scheduled_at >= NOW()`,
            [candidateId]
        );

        // Unread notifications
        const [notificationRows] = await db.promise().query(
            `SELECT COUNT(*) AS unread_notifications
             FROM notifications
             WHERE user_id = ?
             AND is_read = FALSE`,
            [req.user.userId]
        );

        // Recent applications
        const [recentApplications] = await db.promise().query(
            `SELECT
                a.application_id,
                a.status,
                a.applied_at,
                j.job_id,
                j.title AS job_title,
                rp.company_name
             FROM applications a
             JOIN jobs j
                ON a.job_id = j.job_id
             JOIN recruiter_profiles rp
                ON j.recruiter_id = rp.recruiter_id
             WHERE a.candidate_id = ?
             ORDER BY a.applied_at DESC
             LIMIT 5`,
            [candidateId]
        );

        // Upcoming interviews
        const [upcomingInterviews] = await db.promise().query(
            `SELECT
                i.interview_id,
                i.interview_type,
                i.scheduled_at,
                i.duration_minutes,
                i.meeting_link,
                i.location,
                i.interviewer_name,
                i.status,
                j.title AS job_title,
                rp.company_name
             FROM interviews i
             JOIN applications a
                ON i.application_id = a.application_id
             JOIN jobs j
                ON a.job_id = j.job_id
             JOIN recruiter_profiles rp
                ON j.recruiter_id = rp.recruiter_id
             WHERE a.candidate_id = ?
             AND i.status IN ('scheduled', 'rescheduled')
             AND i.scheduled_at >= NOW()
             ORDER BY i.scheduled_at ASC
             LIMIT 5`,
            [candidateId]
        );

        res.json({
            message: "Candidate dashboard loaded successfully",

            statistics: {
                total_applications: applicationStats[0].total_applications,
                applied: applicationStats[0].applied,
                under_review: applicationStats[0].under_review,
                shortlisted: applicationStats[0].shortlisted,
                interview: applicationStats[0].interview,
                selected: applicationStats[0].selected,
                rejected: applicationStats[0].rejected,
                withdrawn: applicationStats[0].withdrawn,
                saved_jobs: savedRows[0].saved_jobs,
                upcoming_interviews: interviewRows[0].upcoming_interviews,
                unread_notifications: notificationRows[0].unread_notifications
            },

            recent_applications: recentApplications,

            upcoming_interviews: upcomingInterviews
        });

    } catch (error) {
        console.error("Candidate dashboard error:", error);

        res.status(500).json({
            message: "Failed to load candidate dashboard",
            error: error.message
        });
    }
};


// ===============================
// RECRUITER DASHBOARD
// ===============================
const getRecruiterDashboard = async (req, res) => {
    try {
        // Get recruiter profile ID
        const [recruiterRows] = await db.promise().query(
            `SELECT recruiter_id
             FROM recruiter_profiles
             WHERE user_id = ?`,
            [req.user.userId]
        );

        if (recruiterRows.length === 0) {
            return res.status(404).json({
                message: "Recruiter profile not found"
            });
        }

        const recruiterId = recruiterRows[0].recruiter_id;

        // Job statistics
        const [jobStats] = await db.promise().query(
            `SELECT
                COUNT(*) AS total_jobs,
                COALESCE(SUM(status = 'published'), 0) AS published,
                COALESCE(SUM(status = 'draft'), 0) AS draft,
                COALESCE(SUM(status = 'closed'), 0) AS closed
             FROM jobs
             WHERE recruiter_id = ?`,
            [recruiterId]
        );

        // Application statistics
        const [applicationStats] = await db.promise().query(
            `SELECT
                COUNT(*) AS total_applications,
                COALESCE(SUM(a.status = 'applied'), 0) AS applied,
                COALESCE(SUM(a.status = 'under_review'), 0) AS under_review,
                COALESCE(SUM(a.status = 'shortlisted'), 0) AS shortlisted,
                COALESCE(SUM(a.status = 'interview'), 0) AS interview,
                COALESCE(SUM(a.status = 'selected'), 0) AS selected,
                COALESCE(SUM(a.status = 'rejected'), 0) AS rejected
             FROM applications a
             JOIN jobs j
                ON a.job_id = j.job_id
             WHERE j.recruiter_id = ?`,
            [recruiterId]
        );

        // Interview count
        const [interviewRows] = await db.promise().query(
            `SELECT COUNT(*) AS total_interviews
             FROM interviews i
             JOIN applications a
                ON i.application_id = a.application_id
             JOIN jobs j
                ON a.job_id = j.job_id
             WHERE j.recruiter_id = ?`,
            [recruiterId]
        );

        // Upcoming interviews
        const [upcomingInterviewRows] = await db.promise().query(
            `SELECT COUNT(*) AS upcoming_interviews
             FROM interviews i
             JOIN applications a
                ON i.application_id = a.application_id
             JOIN jobs j
                ON a.job_id = j.job_id
             WHERE j.recruiter_id = ?
             AND i.status IN ('scheduled', 'rescheduled')
             AND i.scheduled_at >= NOW()`,
            [recruiterId]
        );

        // Unread notifications
        const [notificationRows] = await db.promise().query(
            `SELECT COUNT(*) AS unread_notifications
             FROM notifications
             WHERE user_id = ?
             AND is_read = FALSE`,
            [req.user.userId]
        );

        // Recent applications
        const [recentApplications] = await db.promise().query(
            `SELECT
                a.application_id,
                a.status,
                a.applied_at,
                j.job_id,
                j.title AS job_title,
                u.full_name AS candidate_name
             FROM applications a
             JOIN jobs j
                ON a.job_id = j.job_id
             JOIN candidate_profiles cp
                ON a.candidate_id = cp.candidate_id
             JOIN users u
                ON cp.user_id = u.user_id
             WHERE j.recruiter_id = ?
             ORDER BY a.applied_at DESC
             LIMIT 5`,
            [recruiterId]
        );

        // Recent jobs
        const [recentJobs] = await db.promise().query(
            `SELECT
                job_id,
                title,
                employment_type,
                work_mode,
                location,
                status,
                openings,
                application_deadline,
                created_at
             FROM jobs
             WHERE recruiter_id = ?
             ORDER BY created_at DESC
             LIMIT 5`,
            [recruiterId]
        );

        res.json({
            message: "Recruiter dashboard loaded successfully",

            statistics: {
                total_jobs: jobStats[0].total_jobs,
                published: jobStats[0].published,
                draft: jobStats[0].draft,
                closed: jobStats[0].closed,

                total_applications: applicationStats[0].total_applications,
                applied: applicationStats[0].applied,
                under_review: applicationStats[0].under_review,
                shortlisted: applicationStats[0].shortlisted,
                interview: applicationStats[0].interview,
                selected: applicationStats[0].selected,
                rejected: applicationStats[0].rejected,

                total_interviews: interviewRows[0].total_interviews,
                upcoming_interviews: upcomingInterviewRows[0].upcoming_interviews,
                unread_notifications: notificationRows[0].unread_notifications
            },

            recent_applications: recentApplications,

            recent_jobs: recentJobs
        });

    } catch (error) {
        console.error("Recruiter dashboard error:", error);

        res.status(500).json({
            message: "Failed to load recruiter dashboard",
            error: error.message
        });
    }
};


module.exports = {
    getCandidateDashboard,
    getRecruiterDashboard
};