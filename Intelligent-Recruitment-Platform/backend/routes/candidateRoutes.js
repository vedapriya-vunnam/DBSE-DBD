const express = require("express");

const {
    getCandidateProfile,
    updateCandidateProfile
} = require("../controllers/candidateController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Get candidate profile
router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("candidate"),
    getCandidateProfile
);

// Update candidate profile
router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("candidate"),
    updateCandidateProfile
);

module.exports = router;