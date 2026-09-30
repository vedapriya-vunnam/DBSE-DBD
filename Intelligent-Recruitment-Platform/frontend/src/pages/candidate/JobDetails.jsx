import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CandidateSidebar from "../../components/CandidateSidebar";
import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/jobs/${id}`
      );

      setJob(response.data.job);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load job details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/applications",
        {
          job_id: Number(id)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(
        response.data.message ||
        "Application submitted successfully!"
      );

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to apply for this job"
      );
    }
  };

  const handleSave = async () => {
    try {
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login to save this job.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/saved-jobs",
        {
          job_id: Number(id)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("SAVE RESPONSE:", response.data);

      setMessage(
        response.data.message ||
        "Job saved successfully!"
      );

    } catch (error) {
      console.error(
        "SAVE ERROR:",
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.message ||
        "Failed to save this job"
      );
    }
  };

  if (loading) {
    return (
      <div className="job-details-message">
        Loading job details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-details-message error">
        {error}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-message">
        Job not found.
      </div>
    );
  }

  return (
    <div className="candidate-layout">

      <CandidateSidebar />

      <main className="candidate-main">

        <div className="job-details-page">

          <button
            className="back-button"
            onClick={() => navigate("/candidate/jobs")}
          >
            ← Back to Jobs
          </button>

          <div className="job-details-card">

            {/* Job Header */}
            <div className="job-details-header">

              <div className="job-company-logo">
                {job.company_name
                  ? job.company_name.charAt(0).toUpperCase()
                  : "J"}
              </div>

              <div>
                <p className="job-company">
                  {job.company_name}
                </p>

                <h1>
                  {job.title}
                </h1>

                <p className="job-location">
                  📍 {job.location || "Location not specified"}
                </p>
              </div>

            </div>

            {/* Job Tags */}
            <div className="job-tags">

              <span>
                {job.employment_type}
              </span>

              <span>
                {job.work_mode}
              </span>

              {job.experience_min !== null && (
                <span>
                  {job.experience_min} - {job.experience_max} years
                  experience
                </span>
              )}

            </div>

            {/* Job Body */}
            <div className="job-details-body">

              <section>
                <h2>
                  About the role
                </h2>

                <p className="job-description">
                  {job.description}
                </p>
              </section>

              <section>
                <h2>
                  Compensation
                </h2>

                <p className="job-info-text">
                  ₹
                  {Number(
                    job.salary_min || 0
                  ).toLocaleString("en-IN")}

                  {" - "}

                  ₹
                  {Number(
                    job.salary_max || 0
                  ).toLocaleString("en-IN")}

                  {" "}

                  {job.salary_currency || "INR"}
                </p>
              </section>

              <section>
                <h2>
                  Job information
                </h2>

                <div className="job-info-grid">

                  <div>
                    <span>
                      Employment Type
                    </span>

                    <strong>
                      {job.employment_type}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Work Mode
                    </span>

                    <strong>
                      {job.work_mode}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Location
                    </span>

                    <strong>
                      {job.location || "Not specified"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Openings
                    </span>

                    <strong>
                      {job.openings}
                    </strong>
                  </div>

                </div>
              </section>

              {job.application_deadline && (
                <section>
                  <h2>
                    Application deadline
                  </h2>

                  <p className="job-info-text">
                    {new Date(
                      job.application_deadline
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </section>
              )}

            </div>

            {/* Actions */}
            <div className="job-actions">

              <button
                className="apply-button"
                onClick={handleApply}
              >
                Apply Now
              </button>

              <button
                className="save-button"
                onClick={handleSave}
              >
                ♡ Save Job
              </button>

            </div>

            {/* Backend Response */}
            {message && (
              <div className="job-action-message">
                {message}
              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default JobDetails;