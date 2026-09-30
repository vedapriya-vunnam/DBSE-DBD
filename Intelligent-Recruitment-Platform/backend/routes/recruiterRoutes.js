const express = require("express");

const {
    getRecruiterProfile,
    updateRecruiterProfile
} = require("../controllers/recruiterController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("recruiter"),
    getRecruiterProfile
);

router.put(
    "/profile",
    authMiddleware,
    roleMiddleware("recruiter"),
    updateRecruiterProfile
);

module.exports = router;