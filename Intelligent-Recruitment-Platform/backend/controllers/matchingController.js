const db = require("../config/db");

// =====================================
// GET MATCHED JOBS FOR CANDIDATE
// =====================================
const getMatchedJobs = async (req, res) => {
    try {
        const userId = req.user.userId;

        // ---------------------------------
        // 1. Get candidate ID
        // ---------------------------------
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

        // ---------------------------------
        // 2. Get candidate skills
        // ---------------------------------
        const [candidateSkills] = await db.promise().query(
            `SELECT
                cs.skill_id,
                s.skill_name
             FROM candidate_skills cs
             INNER JOIN skills s
                ON cs.skill_id = s.skill_id
             WHERE cs.candidate_id = ?`,
            [candidateId]
        );

        // If candidate has no skills
        if (candidateSkills.length === 0) {
            return res.status(200).json({
                message: "No candidate skills found",
                count: 0,
                jobs: []
            });
        }

        const candidateSkillIds = new Set(
            candidateSkills.map(skill => skill.skill_id)
        );

        // ---------------------------------
        // 3. Get all published jobs
        // ---------------------------------
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

        const matchedJobs = [];

        // ---------------------------------
        // 4. Calculate match for each job
        // ---------------------------------
        for (const job of jobs) {

            const [jobSkills] = await db.promise().query(
                `SELECT
                    js.skill_id,
                    s.skill_name,
                    js.is_required
                 FROM job_skills js
                 INNER JOIN skills s
                    ON js.skill_id = s.skill_id
                 WHERE js.job_id = ?`,
                [job.job_id]
            );

            // Skip jobs without skills
            if (jobSkills.length === 0) {
                continue;
            }

            const matchedSkills = [];
            const missingSkills = [];
            const matchedRequiredSkills = [];
            const missingRequiredSkills = [];

            for (const skill of jobSkills) {

                if (candidateSkillIds.has(skill.skill_id)) {

                    matchedSkills.push(skill.skill_name);

                    if (skill.is_required) {
                        matchedRequiredSkills.push(skill.skill_name);
                    }

                } else {

                    missingSkills.push(skill.skill_name);

                    if (skill.is_required) {
                        missingRequiredSkills.push(skill.skill_name);
                    }
                }
            }

            // ---------------------------------
            // 5. Calculate percentage
            // ---------------------------------
            const totalSkills = jobSkills.length;
            const matchedCount = matchedSkills.length;

            const matchPercentage =
                Math.round((matchedCount / totalSkills) * 10000) / 100;

            matchedJobs.push({
                job_id: job.job_id,
                title: job.title,
                description: job.description,
                employment_type: job.employment_type,
                work_mode: job.work_mode,
                location: job.location,
                salary_min: job.salary_min,
                salary_max: job.salary_max,
                salary_currency: job.salary_currency,
                experience_min: job.experience_min,
                experience_max: job.experience_max,
                openings: job.openings,
                application_deadline: job.application_deadline,
                created_at: job.created_at,
                company_name: job.company_name,
                company_logo: job.company_logo,

                match_percentage: matchPercentage,

                total_job_skills: totalSkills,
                matched_skill_count: matchedCount,

                matched_skills: matchedSkills,
                missing_skills: missingSkills,

                required_skill_count:
                    jobSkills.filter(skill => skill.is_required).length,

                matched_required_skill_count:
                    matchedRequiredSkills.length,

                missing_required_skills:
                    missingRequiredSkills
            });
        }

        // ---------------------------------
        // 6. Sort by match percentage
        // ---------------------------------
        matchedJobs.sort(
            (a, b) => b.match_percentage - a.match_percentage
        );

        res.status(200).json({
            message: "Job matching completed successfully",
            candidate_skill_count: candidateSkills.length,
            count: matchedJobs.length,
            jobs: matchedJobs
        });

    } catch (error) {
        console.error("Job matching error:", error);

        res.status(500).json({
            message: "Failed to calculate job matches",
            error: error.message
        });
    }
};


// =====================================
// GET MATCH FOR ONE JOB
// =====================================
const getJobMatch = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { job_id } = req.params;

        // ---------------------------------
        // 1. Get candidate ID
        // ---------------------------------
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

        // ---------------------------------
        // 2. Get candidate skills
        // ---------------------------------
        const [candidateSkills] = await db.promise().query(
            `SELECT skill_id, skill_name
             FROM candidate_skills cs
             INNER JOIN skills s
                ON cs.skill_id = s.skill_id
             WHERE candidate_id = ?`,
            [candidateId]
        );

        const candidateSkillIds = new Set(
            candidateSkills.map(skill => skill.skill_id)
        );

        // ---------------------------------
        // 3. Get job
        // ---------------------------------
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
                rp.company_name,
                rp.company_logo
             FROM jobs j
             INNER JOIN recruiter_profiles rp
                ON j.recruiter_id = rp.recruiter_id
             WHERE j.job_id = ?
             AND j.status = 'published'`,
            [job_id]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Published job not found"
            });
        }

        const job = jobs[0];

        // ---------------------------------
        // 4. Get job skills
        // ---------------------------------
        const [jobSkills] = await db.promise().query(
            `SELECT
                js.skill_id,
                s.skill_name,
                js.is_required
             FROM job_skills js
             INNER JOIN skills s
                ON js.skill_id = s.skill_id
             WHERE js.job_id = ?`,
            [job_id]
        );

        if (jobSkills.length === 0) {
            return res.status(200).json({
                message: "No skills configured for this job",
                match_percentage: 0,
                matched_skills: [],
                missing_skills: []
            });
        }

        const matchedSkills = [];
        const missingSkills = [];
        const missingRequiredSkills = [];

        for (const skill of jobSkills) {

            if (candidateSkillIds.has(skill.skill_id)) {
                matchedSkills.push(skill.skill_name);
            } else {
                missingSkills.push(skill.skill_name);

                if (skill.is_required) {
                    missingRequiredSkills.push(skill.skill_name);
                }
            }
        }

        const totalSkills = jobSkills.length;
        const matchedCount = matchedSkills.length;

        const matchPercentage =
            Math.round((matchedCount / totalSkills) * 10000) / 100;

        res.status(200).json({
            message: "Job match calculated successfully",

            job: {
                job_id: job.job_id,
                title: job.title,
                description: job.description,
                employment_type: job.employment_type,
                work_mode: job.work_mode,
                location: job.location,
                salary_min: job.salary_min,
                salary_max: job.salary_max,
                salary_currency: job.salary_currency,
                experience_min: job.experience_min,
                experience_max: job.experience_max,
                openings: job.openings,
                application_deadline: job.application_deadline,
                company_name: job.company_name,
                company_logo: job.company_logo
            },

            match_percentage: matchPercentage,

            total_job_skills: totalSkills,
            matched_skill_count: matchedCount,

            matched_skills: matchedSkills,
            missing_skills: missingSkills,
            missing_required_skills: missingRequiredSkills
        });

    } catch (error) {
        console.error("Single job matching error:", error);

        res.status(500).json({
            message: "Failed to calculate job match",
            error: error.message
        });
    }
};


module.exports = {
    getMatchedJobs,
    getJobMatch
};