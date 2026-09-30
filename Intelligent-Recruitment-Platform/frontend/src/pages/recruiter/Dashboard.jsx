import { useEffect, useState } from "react";
import axios from "axios";
import RecruiterSidebar from "../../components/RecruiterSidebar";
import "./Dashboard.css";

function RecruiterDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/dashboard/recruiter",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "RECRUITER DASHBOARD:",
        response.data
      );

      setDashboard(response.data);

    } catch (error) {
      console.error(
        "RECRUITER DASHBOARD ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to load recruiter dashboard"
      );

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recruiter-loading">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="recruiter-dashboard-message error">
        {error}
      </div>
    );
  }

  const stats = dashboard?.statistics || {};

  return (
    <div className="recruiter-layout">

      <RecruiterSidebar />

      <main className="recruiter-main">

        <div className="recruiter-dashboard">

          <div className="recruiter-dashboard-header">

            <div>

              <p className="dashboard-label">
                RECRUITER DASHBOARD
              </p>

              <h1>
                Welcome back 👋
              </h1>

              <p>
                Manage your job postings, applications
                and hiring activity.
              </p>

            </div>

          </div>


          <div className="recruiter-stats-grid">

            <div className="recruiter-stat-card">

              <div className="stat-icon">
                ▣
              </div>

              <div>
                <span>
                  Total Jobs
                </span>

                <strong>
                  {stats.total_jobs || 0}
                </strong>
              </div>

            </div>


            <div className="recruiter-stat-card">

              <div className="stat-icon">
                ✓
              </div>

              <div>
                <span>
                  Published Jobs
                </span>

                <strong>
                  {stats.published || 0}
                </strong>
              </div>

            </div>


            <div className="recruiter-stat-card">

              <div className="stat-icon">
                ◉
              </div>

              <div>
                <span>
                  Applications
                </span>

                <strong>
                  {stats.total_applications || 0}
                </strong>
              </div>

            </div>


            <div className="recruiter-stat-card">

              <div className="stat-icon">
                ◷
              </div>

              <div>
                <span>
                  Interviews
                </span>

                <strong>
                  {stats.total_interviews || 0}
                </strong>
              </div>

            </div>

          </div>


          <div className="recruiter-dashboard-grid">


            <section className="recruiter-panel">

              <div className="recruiter-panel-header">

                <div>

                  <h2>
                    Recent Applications
                  </h2>

                  <p>
                    Latest candidates who applied to your jobs.
                  </p>

                </div>

              </div>


              {dashboard?.recent_applications?.length > 0 ? (

                <div className="recruiter-list">

                  {dashboard.recent_applications.map(
                    (application) => (

                      <div
                        className="recruiter-application"
                        key={application.application_id}
                      >

                        <div className="application-avatar">

                          {application.candidate_name
                            ? application.candidate_name
                                .charAt(0)
                                .toUpperCase()
                            : "C"}

                        </div>


                        <div className="application-details">

                          <h3>
                            {application.candidate_name ||
                              "Candidate"}
                          </h3>

                          <p>
                            {application.job_title ||
                              "Job"}
                          </p>

                        </div>


                        <span
                          className={`recruiter-status ${
                            application.status || ""
                          }`}
                        >

                          {(application.status || "unknown")
                            .replace("_", " ")
                            .replace(
                              /\b\w/g,
                              (char) =>
                                char.toUpperCase()
                            )}

                        </span>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="recruiter-empty">

                  <div>
                    ▤
                  </div>

                  <h3>
                    No applications yet
                  </h3>

                  <p>
                    Applications will appear here
                    when candidates apply to your jobs.
                  </p>

                </div>

              )}

            </section>


            <section className="recruiter-panel">

              <div className="recruiter-panel-header">

                <div>

                  <h2>
                    Recent Jobs
                  </h2>

                  <p>
                    Your latest job postings.
                  </p>

                </div>

              </div>


              {dashboard?.recent_jobs?.length > 0 ? (

                <div className="recruiter-jobs-list">

                  {dashboard.recent_jobs.map(
                    (job) => (

                      <div
                        className="recruiter-job"
                        key={job.job_id}
                      >

                        <div className="job-mini-icon">

                          {job.title
                            ? job.title
                                .charAt(0)
                                .toUpperCase()
                            : "J"}

                        </div>


                        <div className="job-mini-details">

                          <h3>
                            {job.title}
                          </h3>

                          <p>
                            {job.location ||
                              "Location not specified"}
                          </p>

                        </div>


                        <span
                          className={`job-status ${
                            job.status || ""
                          }`}
                        >
                          {job.status}
                        </span>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <div className="recruiter-empty">

                  <div>
                    ▣
                  </div>

                  <h3>
                    No jobs posted
                  </h3>

                  <p>
                    Your job postings will appear here.
                  </p>

                </div>

              )}

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}

export default RecruiterDashboard;