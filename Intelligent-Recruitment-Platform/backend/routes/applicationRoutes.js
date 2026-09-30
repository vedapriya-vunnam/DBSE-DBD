const express = require("express");

const {
    applyForJob,
    getCandidateApplications,
    getRecruiterApplications,
    updateApplicationStatus
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("candidate"),
    applyForJob
);

router.get(
    "/candidate/my-applications",
    authMiddleware,
    roleMiddleware("candidate"),
    getCandidateApplications
);

router.get(
    "/recruiter/applications",
    authMiddleware,
    roleMiddleware("recruiter"),
    getRecruiterApplications
);

router.put(
    "/:id/status",
    authMiddleware,
    roleMiddleware("recruiter"),
    updateApplicationStatus
);

module.exports = router;