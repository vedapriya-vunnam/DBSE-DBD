const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");
const skillRoutes = require("./routes/skillRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();


// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json());

// =========================
// AUTHENTICATION ROUTES
// =========================
app.use("/api/auth", authRoutes);

// =========================
// CANDIDATE ROUTES
// =========================
app.use("/api/candidate", candidateRoutes);

// =========================
// JOB ROUTES
// =========================
app.use("/api/jobs", jobRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/saved-jobs", savedJobRoutes);

app.use("/api/interviews", interviewRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/recruiter", recruiterRoutes);

app.use("/api/skills", skillRoutes);

app.use("/api/matching", matchingRoutes);
app.use("/api/dashboard", dashboardRoutes);

// =========================
// HOME ROUTE
// =========================
app.get("/", (req, res) => {
    res.json({
        message: "Intelligent Recruitment Platform Backend is running"
    });
});

// =========================
// DATABASE TEST ROUTE
// =========================
app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1 AS result", (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database connection failed",
                error: err.message
            });
        }

        res.json({
            message: "Backend connected to MySQL successfully",
            result: results
        });
    });
});

// =========================
// 404 ROUTE
// =========================
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// =========================
// ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        message: "Internal server error"
    });
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});