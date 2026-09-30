import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CandidateSidebar from "../../components/CandidateSidebar";
import "./SavedJobs.css";

function SavedJobs() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingJob, setRemovingJob] = useState(null);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/saved-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("SAVED JOBS RESPONSE:", response.data);

      const jobs =
        response.data.savedJobs ||
        response.data.jobs ||
        [];

      setSavedJobs(jobs);

    } catch (error) {
      console.error(
        "SAVED JOBS ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to load saved jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (jobId) => {
    try {
      setRemovingJob(jobId);
      setError("");

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/saved-jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSavedJobs((currentJobs) =>
        currentJobs.filter(
          (job) => job.job_id !== jobId
        )
      );

    } catch (error) {
      console.error(
        "REMOVE SAVED JOB ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to remove saved job"
      );
    } finally {
      setRemovingJob(null);
    }
  };

  const formatEmploymentType = (type) => {
    if (!type) return "N/A";

    return type
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatWorkMode = (mode) => {
    if (!mode) return "N/A";

    return mode
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="candidate-layout">

      <CandidateSidebar />

      <main className="candidate-main">

        <div className="saved-jobs-page">

          {/* Header */}
          <div className="saved-jobs-header">

            <div>

              <p className="dashboard-label">
                SAVED JOBS
              </p>

              <h1>
                Jobs you've saved
              </h1>

              <p>
                Keep track of opportunities you want to
                explore later.
              </p>

            </div>

            <div className="saved-jobs-count">

              <span>
                {savedJobs.length}
              </span>

              <small>
                Saved Jobs
              </small>

            </div>

          </div>


          {/* Loading */}
          {loading && (
            <div className="saved-jobs-message">
              Loading your saved jobs...
            </div>
          )}


          {/* Error */}
          {error && (
            <div className="saved-jobs-message error">
              {error}
            </div>
          )}


          {/* Empty State */}
          {!loading &&
            !error &&
            savedJobs.length === 0 && (

              <div className="saved-jobs-empty">

                <div className="saved-empty-icon">
                  ♡
                </div>

                <h2>
                  No saved jobs yet
                </h2>

                <p>
                  Jobs you save will appear here so you
                  can easily find them later.
                </p>

                <button
                  className="browse-jobs-button"
                  onClick={() =>
                    navigate("/candidate/jobs")
                  }
                >
                  Browse Jobs
                  <span>→</span>
                </button>

              </div>

            )
          }


          {/* Saved Jobs */}
          {!loading &&
            !error &&
            savedJobs.length > 0 && (

              <div className="saved-jobs-list">

                {savedJobs.map((job) => (

                  <div
                    className="saved-job-card"
                    key={job.job_id}
                  >

                    {/* Company Logo */}
                    <div className="saved-job-logo">

                      {job.company_name
                        ? job.company_name
                            .charAt(0)
                            .toUpperCase()
                        : "J"}

                    </div>


                    {/* Job Information */}
                    <div className="saved-job-main">

                      <h2>
                        {job.title ||
                          job.job_title ||
                          "Job Title"}
                      </h2>

                      <p className="saved-job-company">
                        {job.company_name ||
                          "Company"}
                      </p>

                      <div className="saved-job-meta">

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
                          🏢{" "}
                          {formatWorkMode(
                            job.work_mode
                          )}
                        </span>

                      </div>

                      {(job.salary_min ||
                        job.salary_max) && (

                        <p className="saved-job-salary">

                          ₹
                          {Number(
                            job.salary_min || 0
                          ).toLocaleString("en-IN")}

                          {" - "}

                          ₹
                          {Number(
                            job.salary_max || 0
                          ).toLocaleString("en-IN")}

                        </p>

                      )}

                      <p className="saved-job-date">
                        Saved on{" "}
                        {formatDate(
                          job.saved_at
                        )}
                      </p>

                    </div>


                    {/* Actions */}
                    <div className="saved-job-actions">

                      <button
                        className="view-saved-button"
                        onClick={() =>
                          navigate(
                            `/candidate/jobs/${job.job_id}`
                          )
                        }
                      >
                        View Job
                        <span>→</span>
                      </button>

                      <button
                        className="remove-saved-button"
                        onClick={() =>
                          handleRemove(
                            job.job_id
                          )
                        }
                        disabled={
                          removingJob ===
                          job.job_id
                        }
                      >
                        {removingJob ===
                        job.job_id
                          ? "Removing..."
                          : "♡ Remove"}
                      </button>

                    </div>

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

export default SavedJobs;