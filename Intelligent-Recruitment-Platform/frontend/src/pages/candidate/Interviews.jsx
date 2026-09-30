import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CandidateSidebar from "../../components/CandidateSidebar";
import "./Interviews.css";

function Interviews() {
  const navigate = useNavigate();

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
        setError("Please login again to view your interviews.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/interviews/candidate",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "CANDIDATE INTERVIEWS RESPONSE:",
        response.data
      );

      setInterviews(
        response.data.interviews ||
        response.data.data ||
        []
      );

    } catch (error) {
      console.error(
        "INTERVIEWS ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to load interviews"
      );

    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const formatTime = (date) => {
    if (!date) return "N/A";

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

  const getStatusClass = (status) => {
    if (status === "completed") {
      return "interview-status completed";
    }

    if (status === "cancelled") {
      return "interview-status cancelled";
    }

    if (status === "rescheduled") {
      return "interview-status rescheduled";
    }

    return "interview-status scheduled";
  };

  const formatStatus = (status) => {
    if (!status) return "Scheduled";

    return status
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="candidate-layout">

      <CandidateSidebar />

      <main className="candidate-main">

        <div className="interviews-page">

          {/* Header */}
          <div className="interviews-header">

            <div>

              <p className="dashboard-label">
                INTERVIEWS
              </p>

              <h1>
                Your interviews
              </h1>

              <p>
                View your scheduled interviews and
                interview details.
              </p>

            </div>

            <div className="interviews-count">

              <span>
                {interviews.length}
              </span>

              <small>
                Interviews
              </small>

            </div>

          </div>


          {/* Loading */}
          {loading && (
            <div className="interviews-message">
              Loading your interviews...
            </div>
          )}


          {/* Error */}
          {!loading && error && (
            <div className="interviews-message error">
              {error}
            </div>
          )}


          {/* Empty */}
          {!loading &&
            !error &&
            interviews.length === 0 && (

              <div className="interviews-empty">

                <div className="interviews-empty-icon">
                  ◷
                </div>

                <h2>
                  No interviews scheduled
                </h2>

                <p>
                  When a recruiter schedules an interview
                  for one of your applications, it will
                  appear here.
                </p>

                <button
                  onClick={() =>
                    navigate("/candidate/applications")
                  }
                >
                  View Applications
                  <span>→</span>
                </button>

              </div>

            )
          }


          {/* Interviews */}
          {!loading &&
            !error &&
            interviews.length > 0 && (

              <div className="interviews-list">

                {interviews.map((interview) => (

                  <div
                    className="interview-card"
                    key={interview.interview_id}
                  >

                    {/* Top */}
                    <div className="interview-card-top">

                      <div className="interview-icon">
                        ◷
                      </div>

                      <div className="interview-main">

                        <h2>
                          {interview.job_title ||
                            interview.title ||
                            "Interview"}
                        </h2>

                        <p className="interview-company">
                          {interview.company_name ||
                            "Company"}
                        </p>

                      </div>

                      <span
                        className={getStatusClass(
                          interview.status
                        )}
                      >
                        {formatStatus(
                          interview.status
                        )}
                      </span>

                    </div>


                    {/* Details */}
                    <div className="interview-details">

                      <div className="interview-detail">

                        <span className="detail-label">
                          DATE
                        </span>

                        <strong>
                          {formatDate(
                            interview.scheduled_at
                          )}
                        </strong>

                      </div>


                      <div className="interview-detail">

                        <span className="detail-label">
                          TIME
                        </span>

                        <strong>
                          {formatTime(
                            interview.scheduled_at
                          )}
                        </strong>

                      </div>


                      <div className="interview-detail">

                        <span className="detail-label">
                          TYPE
                        </span>

                        <strong>
                          {formatInterviewType(
                            interview.interview_type
                          )}
                        </strong>

                      </div>


                      <div className="interview-detail">

                        <span className="detail-label">
                          DURATION
                        </span>

                        <strong>
                          {interview.duration_minutes
                            ? `${interview.duration_minutes} minutes`
                            : "N/A"}
                        </strong>

                      </div>

                    </div>


                    {/* Interviewer */}
                    {interview.interviewer_name && (

                      <div className="interviewer-section">

                        <span>
                          Interviewer
                        </span>

                        <strong>
                          {interview.interviewer_name}
                        </strong>

                      </div>

                    )}


                    {/* Location / Meeting */}
                    {(interview.meeting_link ||
                      interview.location) && (

                      <div className="interview-location">

                        {interview.meeting_link ? (

                          <>
                            <span>
                              Online Interview
                            </span>

                            <a
                              href={
                                interview.meeting_link
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              Join Interview →
                            </a>
                          </>

                        ) : (

                          <>
                            <span>
                              Interview Location
                            </span>

                            <strong>
                              {interview.location}
                            </strong>
                          </>

                        )}

                      </div>

                    )}


                    {/* Notes */}
                    {interview.notes && (

                      <div className="interview-notes">

                        <span>
                          Notes
                        </span>

                        <p>
                          {interview.notes}
                        </p>

                      </div>

                    )}

                  </div>

                ))}

              </div>

            )
          }

        </div>

      </main>

    </div>
  );
}

export default Interviews;