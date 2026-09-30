import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import RecruiterSidebar from "../../components/RecruiterSidebar";
import "./RecruiterJobDetails.css";

function RecruiterJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/jobs/${id}`
      );

      console.log("RECRUITER JOB DETAILS:", response.data);

      setJob(response.data.job);

    } catch (error) {
      console.error(
        "JOB DETAILS ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to load job details"
      );

    } finally {
      setLoading(false);
    }
  };

  const formatType = (value) => {
    if (!value) return "N/A";

    return value
      .replace("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading) {
    return (
      <div className="recruiter-layout">
        <RecruiterSidebar />

        <main className="recruiter-main">
          <div className="recruiter-job-message">
            Loading job details...
          </div>
        </main>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="recruiter-layout">
        <RecruiterSidebar />

        <main className="recruiter-main">
          <div className="recruiter-job-message error">
            {error || "Job not found"}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="recruiter-layout">

      <RecruiterSidebar />

      <main className="recruiter-main">

        <div className="recruiter-job-details">

          <button
            className="recruiter-back-button"
            onClick={() => navigate("/recruiter/jobs")}
          >
            ← Back to My Jobs
          </button>


          <div className="recruiter-job-details-card">

            <div className="recruiter-job-details-header">

              <div className="recruiter-job-icon">
                {job.title
                  ? job.title.charAt(0).toUpperCase()
                  : "J"}
              </div>

              <div className="recruiter-job-heading">

                <div className="recruiter-job-status-row">

                  <span
                    className={`recruiter-detail-status ${
                      job.status || ""
                    }`}
                  >
                    {formatType(job.status)}
                  </span>

                </div>

                <h1>
                  {job.title}
                </h1>

                <p>
                  {job.company_name || "Your Company"}
                </p>

                <span className="recruiter-job-location">
                  📍 {job.location || "Location not specified"}
                </span>

              </div>

            </div>


            <div className="recruiter-detail-tags">

              <span>
                💼 {formatType(job.employment_type)}
              </span>

              <span>
                ◉ {formatType(job.work_mode)}
              </span>

              <span>
                👥 {job.openings || 0}{" "}
                {job.openings === 1
                  ? "Opening"
                  : "Openings"}
              </span>

            </div>


            <section className="recruiter-detail-section">

              <h2>
                Job Description
              </h2>

              <p>
                {job.description ||
                  "No job description provided."}
              </p>

            </section>


            <section className="recruiter-detail-section">

              <h2>
                Compensation
              </h2>

              <p className="recruiter-detail-highlight">

                {job.salary_min || job.salary_max
                  ? `₹${Number(
                      job.salary_min || 0
                    ).toLocaleString("en-IN")} - ₹${Number(
                      job.salary_max || 0
                    ).toLocaleString("en-IN")}`
                  : "Salary not specified"}

                {" "}

                {job.salary_currency || "INR"}

              </p>

            </section>


            <section className="recruiter-detail-section">

              <h2>
                Job Information
              </h2>

              <div className="recruiter-info-grid">

                <div>
                  <span>
                    Employment Type
                  </span>

                  <strong>
                    {formatType(job.employment_type)}
                  </strong>
                </div>

                <div>
                  <span>
                    Work Mode
                  </span>

                  <strong>
                    {formatType(job.work_mode)}
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
                    Experience
                  </span>

                  <strong>
                    {job.experience_min ?? 0} -{" "}
                    {job.experience_max ?? 0} years
                  </strong>
                </div>

                <div>
                  <span>
                    Openings
                  </span>

                  <strong>
                    {job.openings || 0}
                  </strong>
                </div>

                <div>
                  <span>
                    Application Deadline
                  </span>

                  <strong>
                    {job.application_deadline
                      ? new Date(
                          job.application_deadline
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          }
                        )
                      : "No deadline"}
                  </strong>
                </div>

              </div>

            </section>


            <div className="recruiter-detail-actions">

              <button
                className="recruiter-edit-button"
                onClick={() =>
                  navigate(
                    `/recruiter/jobs/${job.job_id}/edit`
                  )
                }
              >
                Edit Job
              </button>

              <button
                className="recruiter-applications-button"
                onClick={() =>
                  navigate("/recruiter/applications")
                }
              >
                View Applications
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default RecruiterJobDetails;