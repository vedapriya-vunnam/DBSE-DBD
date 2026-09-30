const express = require("express");

const {
    scheduleInterview,
    getCandidateInterviews,
    getRecruiterInterviews,
    updateInterviewStatus
} = require("../controllers/interviewController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// RECRUITER ROUTES
// ==========================================

// Schedule an interview
router.post(
    "/",
    authMiddleware,
    roleMiddleware("recruiter"),
    scheduleInterview
);

// View recruiter's interviews
router.get(
    "/recruiter",
    authMiddleware,
    roleMiddleware("recruiter"),
    getRecruiterInterviews
);

// Update interview status
router.put(
    "/:id/status",
    authMiddleware,
    roleMiddleware("recruiter"),
    updateInterviewStatus
);


// ==========================================
// CANDIDATE ROUTES
// ==========================================

// View candidate's interviews
router.get(
    "/candidate",
    authMiddleware,
    roleMiddleware("candidate"),
    getCandidateInterviews
);


module.exports = router;