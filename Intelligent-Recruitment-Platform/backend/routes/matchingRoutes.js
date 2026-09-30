const express = require("express");

const {
    getMatchedJobs,
    getJobMatch
} = require("../controllers/matchingController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// Get all jobs matched to logged-in candidate
router.get(
    "/jobs",
    authMiddleware,
    roleMiddleware("candidate"),
    getMatchedJobs
);


// Get match for one specific job
router.get(
    "/jobs/:job_id",
    authMiddleware,
    roleMiddleware("candidate"),
    getJobMatch
);


module.exports = router;