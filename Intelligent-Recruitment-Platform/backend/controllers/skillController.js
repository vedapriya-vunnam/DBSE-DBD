const db = require("../config/db");

// =====================================
// GET ALL SKILLS
// =====================================
const getAllSkills = async (req, res) => {
    try {
        const [skills] = await db.promise().query(
            `SELECT skill_id, skill_name, created_at
             FROM skills
             ORDER BY skill_name ASC`
        );

        res.status(200).json({
            message: "Skills retrieved successfully",
            count: skills.length,
            skills
        });

    } catch (error) {
        console.error("Get skills error:", error);

        res.status(500).json({
            message: "Failed to retrieve skills",
            error: error.message
        });
    }
};


// =====================================
// CREATE SKILL
// =====================================
const createSkill = async (req, res) => {
    try {
        const { skill_name } = req.body;

        if (!skill_name || !skill_name.trim()) {
            return res.status(400).json({
                message: "Skill name is required"
            });
        }

        const cleanSkillName = skill_name.trim();

        const [existing] = await db.promise().query(
            `SELECT skill_id
             FROM skills
             WHERE skill_name = ?`,
            [cleanSkillName]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Skill already exists"
            });
        }

        const [result] = await db.promise().query(
            `INSERT INTO skills (skill_name)
             VALUES (?)`,
            [cleanSkillName]
        );

        res.status(201).json({
            message: "Skill created successfully",
            skill_id: result.insertId
        });

    } catch (error) {
        console.error("Create skill error:", error);

        res.status(500).json({
            message: "Failed to create skill",
            error: error.message
        });
    }
};


// =====================================
// ADD SKILL TO CANDIDATE
// =====================================
const addCandidateSkill = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { skill_id, proficiency } = req.body;

        const allowedProficiency = [
            "beginner",
            "intermediate",
            "advanced",
            "expert"
        ];

        if (!skill_id || !proficiency) {
            return res.status(400).json({
                message: "Skill ID and proficiency are required"
            });
        }

        if (!allowedProficiency.includes(proficiency)) {
            return res.status(400).json({
                message: "Invalid proficiency level"
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

        // Check skill exists
        const [skills] = await db.promise().query(
            `SELECT skill_id
             FROM skills
             WHERE skill_id = ?`,
            [skill_id]
        );

        if (skills.length === 0) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        // Check duplicate
        const [existing] = await db.promise().query(
            `SELECT candidate_id
             FROM candidate_skills
             WHERE candidate_id = ?
             AND skill_id = ?`,
            [candidateId, skill_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Candidate already has this skill"
            });
        }

        await db.promise().query(
            `INSERT INTO candidate_skills
             (candidate_id, skill_id, proficiency)
             VALUES (?, ?, ?)`,
            [candidateId, skill_id, proficiency]
        );

        res.status(201).json({
            message: "Skill added to candidate profile successfully"
        });

    } catch (error) {
        console.error("Add candidate skill error:", error);

        res.status(500).json({
            message: "Failed to add candidate skill",
            error: error.message
        });
    }
};


// =====================================
// GET CANDIDATE SKILLS
// =====================================
const getCandidateSkills = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [skills] = await db.promise().query(
            `SELECT
                s.skill_id,
                s.skill_name,
                cs.proficiency
             FROM candidate_skills cs
             INNER JOIN candidate_profiles cp
                ON cs.candidate_id = cp.candidate_id
             INNER JOIN skills s
                ON cs.skill_id = s.skill_id
             WHERE cp.user_id = ?
             ORDER BY s.skill_name ASC`,
            [userId]
        );

        res.status(200).json({
            message: "Candidate skills retrieved successfully",
            count: skills.length,
            skills
        });

    } catch (error) {
        console.error("Get candidate skills error:", error);

        res.status(500).json({
            message: "Failed to retrieve candidate skills",
            error: error.message
        });
    }
};


// =====================================
// REMOVE CANDIDATE SKILL
// =====================================
const removeCandidateSkill = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { skill_id } = req.params;

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

        const [result] = await db.promise().query(
            `DELETE FROM candidate_skills
             WHERE candidate_id = ?
             AND skill_id = ?`,
            [candidateId, skill_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Candidate skill not found"
            });
        }

        res.status(200).json({
            message: "Candidate skill removed successfully"
        });

    } catch (error) {
        console.error("Remove candidate skill error:", error);

        res.status(500).json({
            message: "Failed to remove candidate skill",
            error: error.message
        });
    }
};


// =====================================
// ADD SKILL TO JOB
// =====================================
const addJobSkill = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { job_id } = req.params;
        const { skill_id, is_required } = req.body;

        if (!skill_id) {
            return res.status(400).json({
                message: "Skill ID is required"
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

        // Check job belongs to recruiter
        const [jobs] = await db.promise().query(
            `SELECT job_id
             FROM jobs
             WHERE job_id = ?
             AND recruiter_id = ?`,
            [job_id, recruiterId]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Job not found or you do not own this job"
            });
        }

        // Check skill exists
        const [skills] = await db.promise().query(
            `SELECT skill_id
             FROM skills
             WHERE skill_id = ?`,
            [skill_id]
        );

        if (skills.length === 0) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        // Check duplicate
        const [existing] = await db.promise().query(
            `SELECT job_id
             FROM job_skills
             WHERE job_id = ?
             AND skill_id = ?`,
            [job_id, skill_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Skill already added to this job"
            });
        }

        await db.promise().query(
            `INSERT INTO job_skills
             (job_id, skill_id, is_required)
             VALUES (?, ?, ?)`,
            [
                job_id,
                skill_id,
                is_required === undefined ? true : Boolean(is_required)
            ]
        );

        res.status(201).json({
            message: "Skill added to job successfully"
        });

    } catch (error) {
        console.error("Add job skill error:", error);

        res.status(500).json({
            message: "Failed to add job skill",
            error: error.message
        });
    }
};


// =====================================
// GET JOB SKILLS
// =====================================
const getJobSkills = async (req, res) => {
    try {
        const { job_id } = req.params;

        const [skills] = await db.promise().query(
            `SELECT
                s.skill_id,
                s.skill_name,
                js.is_required
             FROM job_skills js
             INNER JOIN skills s
                ON js.skill_id = s.skill_id
             WHERE js.job_id = ?
             ORDER BY js.is_required DESC, s.skill_name ASC`,
            [job_id]
        );

        res.status(200).json({
            message: "Job skills retrieved successfully",
            count: skills.length,
            skills
        });

    } catch (error) {
        console.error("Get job skills error:", error);

        res.status(500).json({
            message: "Failed to retrieve job skills",
            error: error.message
        });
    }
};


// =====================================
// REMOVE JOB SKILL
// =====================================
const removeJobSkill = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { job_id, skill_id } = req.params;

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
            `DELETE js
             FROM job_skills js
             INNER JOIN jobs j
                ON js.job_id = j.job_id
             WHERE js.job_id = ?
             AND js.skill_id = ?
             AND j.recruiter_id = ?`,
            [job_id, skill_id, recruiterId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Job skill not found"
            });
        }

        res.status(200).json({
            message: "Job skill removed successfully"
        });

    } catch (error) {
        console.error("Remove job skill error:", error);

        res.status(500).json({
            message: "Failed to remove job skill",
            error: error.message
        });
    }
};


module.exports = {
    getAllSkills,
    createSkill,
    addCandidateSkill,
    getCandidateSkills,
    removeCandidateSkill,
    addJobSkill,
    getJobSkills,
    removeJobSkill
};