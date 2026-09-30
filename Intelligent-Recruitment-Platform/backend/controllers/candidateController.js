const db = require("../config/db");

// ===============================
// GET CANDIDATE PROFILE
// ===============================
const getCandidateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [rows] = await db.promise().query(
            `SELECT
                u.user_id,
                u.full_name,
                u.email,
                u.phone,
                cp.headline,
                cp.bio,
                cp.location,
                cp.education,
                cp.experience_years,
                cp.resume_url,
                cp.linkedin_url,
                cp.github_url,
                cp.portfolio_url
             FROM users u
             LEFT JOIN candidate_profiles cp
             ON u.user_id = cp.user_id
             WHERE u.user_id = ? AND u.role = 'candidate'`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Candidate profile not found"
            });
        }

        res.status(200).json({
            message: "Candidate profile retrieved successfully",
            profile: rows[0]
        });

    } catch (error) {
        console.error("Get candidate profile error:", error);

        res.status(500).json({
            message: "Failed to retrieve candidate profile",
            error: error.message
        });
    }
};


// ===============================
// UPDATE CANDIDATE PROFILE
// ===============================
const updateCandidateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            full_name,
            phone,
            headline,
            bio,
            location,
            education,
            experience_years,
            resume_url,
            linkedin_url,
            github_url,
            portfolio_url
        } = req.body;

        // Update users table
        await db.promise().query(
            `UPDATE users
             SET full_name = ?, phone = ?
             WHERE user_id = ? AND role = 'candidate'`,
            [
                full_name || null,
                phone || null,
                userId
            ]
        );

        // Update candidate profile
        await db.promise().query(
            `UPDATE candidate_profiles
             SET
                headline = ?,
                bio = ?,
                location = ?,
                education = ?,
                experience_years = ?,
                resume_url = ?,
                linkedin_url = ?,
                github_url = ?,
                portfolio_url = ?
             WHERE user_id = ?`,
            [
                headline || null,
                bio || null,
                location || null,
                education || null,
                experience_years || 0,
                resume_url || null,
                linkedin_url || null,
                github_url || null,
                portfolio_url || null,
                userId
            ]
        );

        res.status(200).json({
            message: "Candidate profile updated successfully"
        });

    } catch (error) {
        console.error("Update candidate profile error:", error);

        res.status(500).json({
            message: "Failed to update candidate profile",
            error: error.message
        });
    }
};


module.exports = {
    getCandidateProfile,
    updateCandidateProfile
};