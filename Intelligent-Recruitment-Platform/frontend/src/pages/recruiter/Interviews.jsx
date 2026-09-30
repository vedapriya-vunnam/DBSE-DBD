import { useEffect, useState } from "react";
import axios from "axios";
import RecruiterSidebar from "../../components/RecruiterSidebar";
import "./Interviews.css";

function Interviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login again.");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/api/interviews/recruiter",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("RECRUITER INTERVIEWS:", response.data);

            setInterviews(
                response.data.interviews ||
                response.data.data ||
                []
            );

        } catch (err) {
            console.error(
                "INTERVIEWS ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Failed to load interviews"
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "Date not specified";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatTime = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatInterviewType = (type) => {
        if (!type) return "Interview";

        return type
            .replace("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:5000/api/interviews/${id}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Interview status updated successfully!");

            fetchInterviews();

        } catch (err) {
            console.error(
                "UPDATE INTERVIEW ERROR:",
                err.response?.data || err.message
            );

            alert(
                err.response?.data?.message ||
                "Failed to update interview status"
            );
        }
    };

    return (
        <div className="recruiter-layout">

            <RecruiterSidebar />

            <main className="recruiter-main">

                <div className="recruiter-interviews-page">

                    <div className="interviews-header">

                        <div>
                            <p className="page-label">
                                INTERVIEW MANAGEMENT
                            </p>

                            <h1>Interviews</h1>

                            <p>
                                Manage and track interviews scheduled with candidates.
                            </p>
                        </div>

                        <div className="interview-count">
                            {interviews.length}{" "}
                            {interviews.length === 1
                                ? "Interview"
                                : "Interviews"}
                        </div>

                    </div>

                    {loading && (
                        <div className="interviews-message">
                            Loading interviews...
                        </div>
                    )}

                    {error && (
                        <div className="interviews-message error">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        interviews.length === 0 && (

                            <div className="interviews-empty">

                                <div className="empty-interview-icon">
                                    ◷
                                </div>

                                <h2>
                                    No interviews scheduled
                                </h2>

                                <p>
                                    Interviews scheduled with candidates
                                    will appear here.
                                </p>

                            </div>
                        )}

                    {!loading &&
                        !error &&
                        interviews.length > 0 && (

                            <div className="interviews-list">

                                {interviews.map((interview) => (

                                    <div
                                        className="interview-card"
                                        key={interview.interview_id}
                                    >

                                        <div className="interview-date-box">

                                            <strong>
                                                {interview.scheduled_at
                                                    ? new Date(
                                                          interview.scheduled_at
                                                      ).getDate()
                                                    : "--"}
                                            </strong>

                                            <span>
                                                {interview.scheduled_at
                                                    ? new Date(
                                                          interview.scheduled_at
                                                      ).toLocaleDateString(
                                                          "en-IN",
                                                          {
                                                              month: "short"
                                                          }
                                                      )
                                                    : ""}
                                            </span>

                                        </div>

                                        <div className="interview-content">

                                            <div className="interview-top">

                                                <div>
                                                    <h2>
                                                        {interview.job_title ||
                                                            "Interview"}
                                                    </h2>

                                                    <p className="candidate-name">
                                                        Candidate:{" "}
                                                        {interview.candidate_name ||
                                                            interview.full_name ||
                                                            "Candidate"}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`interview-status ${
                                                        interview.status || ""
                                                    }`}
                                                >
                                                    {interview.status
                                                        ? interview.status
                                                              .replace(
                                                                  "_",
                                                                  " "
                                                              )
                                                              .replace(
                                                                  /\b\w/g,
                                                                  (char) =>
                                                                      char.toUpperCase()
                                                              )
                                                        : "Scheduled"}
                                                </span>

                                            </div>

                                            <div className="interview-details">

                                                <span>
                                                    📅{" "}
                                                    {formatDate(
                                                        interview.scheduled_at
                                                    )}
                                                </span>

                                                <span>
                                                    🕐{" "}
                                                    {formatTime(
                                                        interview.scheduled_at
                                                    )}
                                                </span>

                                                <span>
                                                    ⏱{" "}
                                                    {interview.duration_minutes ||
                                                        30}{" "}
                                                    min
                                                </span>

                                                <span>
                                                    💻{" "}
                                                    {formatInterviewType(
                                                        interview.interview_type
                                                    )}
                                                </span>

                                            </div>

                                            {interview.interviewer_name && (
                                                <p className="interviewer-info">
                                                    Interviewer:{" "}
                                                    {interview.interviewer_name}
                                                </p>
                                            )}

                                            {interview.meeting_link && (
                                                <a
                                                    href={
                                                        interview.meeting_link
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="meeting-link"
                                                >
                                                    Join Meeting →
                                                </a>
                                            )}

                                            <div className="interview-actions">

                                                <select
                                                    value={
                                                        interview.status ||
                                                        "scheduled"
                                                    }
                                                    onChange={(e) =>
                                                        updateStatus(
                                                            interview.interview_id,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="scheduled">
                                                        Scheduled
                                                    </option>

                                                    <option value="completed">
                                                        Completed
                                                    </option>

                                                    <option value="cancelled">
                                                        Cancelled
                                                    </option>

                                                    <option value="rescheduled">
                                                        Rescheduled
                                                    </option>
                                                </select>

                                            </div>

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

export default Interviews;