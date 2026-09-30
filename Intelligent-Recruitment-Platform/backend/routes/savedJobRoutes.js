const express = require("express");

const {
    saveJob,
    getSavedJobs,
    removeSavedJob
} = require("../controllers/savedJobController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// SAVE A JOB
// ==========================================
router.post(
    "/",
    authMiddleware,
    roleMiddleware("candidate"),
    saveJob
);


// ==========================================
// GET SAVED JOBS
// ==========================================
router.get(
    "/",
    authMiddleware,
    roleMiddleware("candidate"),
    getSavedJobs
);


// ==========================================
// REMOVE SAVED JOB
// ==========================================
router.delete(
    "/:job_id",
    authMiddleware,
    roleMiddleware("candidate"),
    removeSavedJob
);


module.exports = router;