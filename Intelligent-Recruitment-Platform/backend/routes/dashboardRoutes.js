const express = require("express");

const {
    getCandidateDashboard,
    getRecruiterDashboard
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/candidate",
    authMiddleware,
    roleMiddleware("candidate"),
    getCandidateDashboard
);

router.get(
    "/recruiter",
    authMiddleware,
    roleMiddleware("recruiter"),
    getRecruiterDashboard
);

module.exports = router;