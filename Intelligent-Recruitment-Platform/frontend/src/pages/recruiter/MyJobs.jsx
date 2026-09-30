import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RecruiterSidebar from "../../components/RecruiterSidebar";
import "./MyJobs.css";

function MyJobs() {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login again.");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/api/jobs/recruiter/my-jobs",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "RECRUITER JOBS RESPONSE:",
                response.data
            );

            setJobs(
                response.data.jobs ||
                response.data.data ||
                []
            );

        } catch (error) {
            console.error(
                "MY JOBS ERROR:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Failed to load your jobs"
            );
        } finally {
            setLoading(false);
        }
    };

    const formatEmploymentType = (type) => {
        if (!type) return "N/A";

        return type
            .replace("_", " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    const formatWorkMode = (mode) => {
        if (!mode) return "N/A";

        return mode
            .replace("_", " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    const formatSalary = (min, max, currency) => {
        if (!min && !max) {
            return "Salary not specified";
        }

        const symbol =
            currency === "INR"
                ? "₹"
                : currency || "";

        return `${symbol}${Number(
            min || 0
        ).toLocaleString("en-IN")} - ${symbol}${Number(
            max || 0
        ).toLocaleString("en-IN")}`;
    };

    return (
        <div className="recruiter-layout">

            <RecruiterSidebar />

            <main className="recruiter-main">

                <div className="recruiter-page">

                    <div className="my-jobs-header">

                        <div>
                            <p className="dashboard-label">
                                JOB MANAGEMENT
                            </p>

                            <h1>
                                My Jobs
                            </h1>

                            <p>
                                Manage your job postings and track their status.
                            </p>
                        </div>

                        {/* CREATE JOB BUTTON */}
                        <button
                            className="create-job-button"
                            onClick={() =>
                                navigate(
                                    "/recruiter/jobs/create"
                                )
                            }
                        >
                            + Create Job
                        </button>

                    </div>

                    {loading && (
                        <div className="my-jobs-message">
                            Loading your jobs...
                        </div>
                    )}

                    {error && (
                        <div className="my-jobs-message error">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        jobs.length === 0 && (

                            <div className="my-jobs-empty">

                                <div className="empty-job-icon">
                                    ▣
                                </div>

                                <h2>
                                    No jobs posted yet
                                </h2>

                                <p>
                                    Create your first job posting to start
                                    receiving applications.
                                </p>

                                <button
                                    className="create-job-button"
                                    onClick={() =>
                                        navigate(
                                            "/recruiter/jobs/create"
                                        )
                                    }
                                >
                                    + Create Your First Job
                                </button>

                            </div>
                        )}

                    {!loading &&
                        !error &&
                        jobs.length > 0 && (

                            <div className="my-jobs-list">

                                {jobs.map((job) => (

                                    <div
                                        className="my-job-card"
                                        key={job.job_id}
                                    >

                                        <div className="my-job-main">

                                            <div className="job-company-icon">
                                                {job.title
                                                    ? job.title
                                                          .charAt(0)
                                                          .toUpperCase()
                                                    : "J"}
                                            </div>

                                            <div className="my-job-content">

                                                <div className="my-job-title-row">

                                                    <div>

                                                        <h2>
                                                            {job.title}
                                                        </h2>

                                                        <p>
                                                            {job.company_name ||
                                                                "Your Company"}
                                                        </p>

                                                    </div>

                                                    <span
                                                        className={`my-job-status ${
                                                            job.status || ""
                                                        }`}
                                                    >
                                                        {job.status
                                                            ? job.status
                                                                  .replace(
                                                                      "_",
                                                                      " "
                                                                  )
                                                                  .replace(
                                                                      /\b\w/g,
                                                                      (char) =>
                                                                          char.toUpperCase()
                                                                  )
                                                            : "Unknown"}
                                                    </span>

                                                </div>

                                                <div className="my-job-meta">

                                                    <span>
                                                        📍{" "}
                                                        {job.location ||
                                                            "Location not specified"}
                                                    </span>

                                                    <span>
                                                        💼{" "}
                                                        {formatEmploymentType(
                                                            job.employment_type
                                                        )}
                                                    </span>

                                                    <span>
                                                        ◉{" "}
                                                        {formatWorkMode(
                                                            job.work_mode
                                                        )}
                                                    </span>

                                                    <span>
                                                        {formatSalary(
                                                            job.salary_min,
                                                            job.salary_max,
                                                            job.salary_currency
                                                        )}
                                                    </span>

                                                </div>

                                                <div className="my-job-bottom">

                                                    <span>
                                                        {job.openings || 0}{" "}
                                                        {job.openings === 1
                                                            ? "opening"
                                                            : "openings"}
                                                    </span>

                                                    {job.application_deadline && (
                                                        <span>
                                                            Deadline:{" "}
                                                            {new Date(
                                                                job.application_deadline
                                                            ).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                    year: "numeric"
                                                                }
                                                            )}
                                                        </span>
                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                        <div className="my-job-actions">

                                            {/* VIEW */}
                                            <button
                                                className="view-job-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/recruiter/jobs/${job.job_id}`
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                            {/* EDIT */}
                                            <button
                                                className="edit-job-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/recruiter/jobs/${job.job_id}/edit`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>
                        )}

                </div>

            </main>

        </div>
    );
}

export default MyJobs;