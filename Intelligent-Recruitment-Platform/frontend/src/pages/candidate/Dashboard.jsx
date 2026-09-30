import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import CandidateSidebar from "../../components/CandidateSidebar";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/dashboard/candidate",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setDashboard(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading your dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        {error}
      </div>
    );
  }

  const stats = dashboard?.statistics || {};

  return (
    <div className="candidate-layout">

      <CandidateSidebar />

      <main className="candidate-main">

        <div className="candidate-dashboard">

          {/* Header */}
          <header className="dashboard-header">

            <div>
              <p className="dashboard-label">
                CANDIDATE DASHBOARD
              </p>

              <h1>Welcome back 👋</h1>

              <p className="dashboard-subtitle">
                Here's an overview of your recruitment activity.
              </p>
            </div>

            <div className="dashboard-user">
              <div className="user-avatar">
                C
              </div>
            </div>

          </header>

          {/* Statistics */}
          <section className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon purple">A</div>

              <div>
                <p>Total Applications</p>
                <h2>{stats.total_applications || 0}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">S</div>

              <div>
                <p>Shortlisted</p>
                <h2>{stats.shortlisted || 0}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">I</div>

              <div>
                <p>Interviews</p>
                <h2>{stats.interview || 0}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">★</div>

              <div>
                <p>Saved Jobs</p>
                <h2>{stats.saved_jobs || 0}</h2>
              </div>
            </div>

          </section>

          {/* Main Content */}
          <section className="dashboard-content">

            {/* Recent Applications */}
            <div className="dashboard-panel">

              <div className="panel-header">
                <div>
                  <h2>Recent Applications</h2>
                  <p>Your latest job applications</p>
                </div>
              </div>

              {dashboard?.recent_applications?.length > 0 ? (

                <div className="application-list">

                  {dashboard.recent_applications.map((application) => (

                    <div
                      className="application-item"
                      key={application.application_id}
                    >

                      <div className="company-placeholder">
                        {application.company_name?.charAt(0) || "J"}
                      </div>

                      <div className="application-info">

                        <h3>
                          {application.job_title}
                        </h3>

                        <p>
                          {application.company_name}
                        </p>

                      </div>

                      <span
                        className={`status ${application.status}`}
                      >
                        {application.status.replace("_", " ")}
                      </span>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="empty-state">
                  <div className="empty-icon">📄</div>

                  <h3>No applications yet</h3>

                  <p>
                    Your applications will appear here once
                    you apply for a job.
                  </p>

                </div>

              )}

            </div>

            {/* Upcoming Interviews */}
            <div className="dashboard-panel">

              <div className="panel-header">
                <div>
                  <h2>Upcoming Interviews</h2>
                  <p>Your scheduled interviews</p>
                </div>
              </div>

              {dashboard?.upcoming_interviews?.length > 0 ? (

                <div className="interview-list">

                  {dashboard.upcoming_interviews.map((interview) => (

                    <div
                      className="interview-item"
                      key={interview.interview_id}
                    >

                      <div className="interview-date">

                        <span>
                          {new Date(
                            interview.scheduled_at
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit"
                          })}
                        </span>

                        <small>
                          {new Date(
                            interview.scheduled_at
                          ).toLocaleDateString("en-IN", {
                            month: "short"
                          })}
                        </small>

                      </div>

                      <div className="interview-info">

                        <h3>
                          {interview.job_title}
                        </h3>

                        <p>
                          {interview.company_name}
                        </p>

                        <span>
                          {interview.interview_type}
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              ) : (

                <div className="empty-state">
                  <div className="empty-icon">📅</div>

                  <h3>No upcoming interviews</h3>

                  <p>
                    Scheduled interviews will appear here.
                  </p>

                </div>

              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;