const express = require("express");

const {
    createJob,
    getAllJobs,
    searchJobs,
    getJobById,
    getRecruiterJobs,
    updateJob,
    updateJobStatus,
    deleteJob
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================================
// CREATE JOB
// =====================================
router.post(
    "/",
    authMiddleware,
    roleMiddleware("recruiter"),
    createJob
);


// =====================================
// SEARCH JOBS
// IMPORTANT: Must come before /:id
// =====================================
router.get(
    "/search",
    searchJobs
);


// =====================================
// GET RECRUITER'S JOBS
// IMPORTANT: Must come before /:id
// =====================================
router.get(
    "/recruiter/my-jobs",
    authMiddleware,
    roleMiddleware("recruiter"),
    getRecruiterJobs
);


// =====================================
// GET ALL PUBLISHED JOBS
// =====================================
router.get(
    "/",
    getAllJobs
);


// =====================================
// GET SINGLE JOB
// =====================================
router.get(
    "/:id",
    getJobById
);


// =====================================
// UPDATE JOB
// =====================================
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("recruiter"),
    updateJob
);


// =====================================
// UPDATE JOB STATUS
// =====================================
router.put(
    "/:id/status",
    authMiddleware,
    roleMiddleware("recruiter"),
    updateJobStatus
);


// =====================================
// DELETE JOB
// =====================================
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("recruiter"),
    deleteJob
);


module.exports = router;