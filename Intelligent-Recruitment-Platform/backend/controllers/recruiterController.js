const db = require("../config/db");

// =====================================
// GET RECRUITER PROFILE
// =====================================
const getRecruiterProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [rows] = await db.promise().query(
            `SELECT
                u.user_id,
                u.full_name,
                u.email,
                u.phone,
                u.profile_image,
                rp.recruiter_id,
                rp.company_name,
                rp.company_description,
                rp.company_website,
                rp.company_location,
                rp.company_logo,
                rp.created_at,
                rp.updated_at
             FROM users u
             INNER JOIN recruiter_profiles rp
                ON u.user_id = rp.user_id
             WHERE u.user_id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Recruiter profile not found"
            });
        }

        res.status(200).json({
            message: "Recruiter profile retrieved successfully",
            profile: rows[0]
        });

    } catch (error) {
        console.error("Get recruiter profile error:", error);

        res.status(500).json({
            message: "Failed to retrieve recruiter profile",
            error: error.message
        });
    }
};


// =====================================
// UPDATE RECRUITER PROFILE
// =====================================
const updateRecruiterProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            full_name,
            phone,
            profile_image,
            company_name,
            company_description,
            company_website,
            company_location,
            company_logo
        } = req.body;

        if (!company_name) {
            return res.status(400).json({
                message: "Company name is required"
            });
        }

        // Update user information
        await db.promise().query(
            `UPDATE users
             SET full_name = ?,
                 phone = ?,
                 profile_image = ?
             WHERE user_id = ?`,
            [
                full_name || null,
                phone || null,
                profile_image || null,
                userId
            ]
        );

        // Update recruiter information
        const [result] = await db.promise().query(
            `UPDATE recruiter_profiles
             SET company_name = ?,
                 company_description = ?,
                 company_website = ?,
                 company_location = ?,
                 company_logo = ?
             WHERE user_id = ?`,
            [
                company_name,
                company_description || null,
                company_website || null,
                company_location || null,
                company_logo || null,
                userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Recruiter profile not found"
            });
        }

        res.status(200).json({
            message: "Recruiter profile updated successfully"
        });

    } catch (error) {
        console.error("Update recruiter profile error:", error);

        res.status(500).json({
            message: "Failed to update recruiter profile",
            error: error.message
        });
    }
};


module.exports = {
    getRecruiterProfile,
    updateRecruiterProfile
};