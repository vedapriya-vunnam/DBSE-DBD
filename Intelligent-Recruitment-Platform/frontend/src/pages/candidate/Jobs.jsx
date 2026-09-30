import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CandidateSidebar from "../../components/CandidateSidebar";
import "./Jobs.css";

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/jobs/search"
      );

      setJobs(response.data.jobs || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="candidate-layout">

      <CandidateSidebar />

      <main className="candidate-main">

        <div className="jobs-page">

          <div className="jobs-header">
            <div>
              <p className="dashboard-label">
                OPPORTUNITIES
              </p>

              <h1>
                Find your next opportunity
              </h1>

              <p>
                Explore jobs that match your skills and career goals.
              </p>
            </div>
          </div>

          {loading && (
            <div className="jobs-message">
              Loading available jobs...
            </div>
          )}

          {error && (
            <div className="jobs-message error">
              {error}
            </div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="jobs-empty">

              <div className="jobs-empty-icon">
                ⌕
              </div>

              <h2>
                No jobs available
              </h2>

              <p>
                There are currently no published jobs available.
              </p>

            </div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <div className="jobs-grid">

              {jobs.map((job) => (

                <div
                  className="job-card"
                  key={job.job_id}
                >

                  <div className="job-card-top">

                    <div className="company-logo">
                      {job.company_name
                        ? job.company_name.charAt(0).toUpperCase()
                        : "J"}
                    </div>

                    <span className="job-type">
                      {job.employment_type}
                    </span>

                  </div>

                  <h2>
                    {job.title}
                  </h2>

                  <p className="company-name">
                    {job.company_name}
                  </p>

                  <div className="job-details">

                    <span>
                      📍 {job.location || "Location not specified"}
                    </span>

                    <span>
                      💼 {job.work_mode}
                    </span>

                  </div>

                  {(job.salary_min || job.salary_max) && (
                    <p className="salary">
                      ₹{Number(
                        job.salary_min || 0
                      ).toLocaleString("en-IN")}

                      {" - "}

                      ₹{Number(
                        job.salary_max || 0
                      ).toLocaleString("en-IN")}
                    </p>
                  )}

                  <button
                    className="view-job-button"
                    onClick={() =>
                      navigate(`/candidate/jobs/${job.job_id}`)
                    }
                  >
                    View Job
                    <span>→</span>
                  </button>

                </div>

              ))}

            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default Jobs;