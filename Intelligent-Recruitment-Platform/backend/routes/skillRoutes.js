const express = require("express");

const {
    getAllSkills,
    createSkill,
    addCandidateSkill,
    getCandidateSkills,
    removeCandidateSkill,
    addJobSkill,
    getJobSkills,
    removeJobSkill
} = require("../controllers/skillController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================================
// SKILL MASTER
// =====================================

router.get("/", getAllSkills);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("recruiter"),
    createSkill
);


// =====================================
// CANDIDATE SKILLS
// =====================================

router.get(
    "/candidate",
    authMiddleware,
    roleMiddleware("candidate"),
    getCandidateSkills
);

router.post(
    "/candidate",
    authMiddleware,
    roleMiddleware("candidate"),
    addCandidateSkill
);

router.delete(
    "/candidate/:skill_id",
    authMiddleware,
    roleMiddleware("candidate"),
    removeCandidateSkill
);


// =====================================
// JOB SKILLS
// =====================================

router.get(
    "/job/:job_id",
    getJobSkills
);

router.post(
    "/job/:job_id",
    authMiddleware,
    roleMiddleware("recruiter"),
    addJobSkill
);

router.delete(
    "/job/:job_id/:skill_id",
    authMiddleware,
    roleMiddleware("recruiter"),
    removeJobSkill
);


module.exports = router;