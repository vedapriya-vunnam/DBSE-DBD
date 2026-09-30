import { useEffect, useState } from "react";
import axios from "axios";
import CandidateSidebar from "../../components/CandidateSidebar";
import "./Applications.css";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/applications/candidate/my-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("APPLICATION DATA:", response.data);

      setApplications(response.data.applications || []);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return `application-status ${status}`;
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
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

        <div className="applications-page">

          {/* Header */}
          <div className="applications-header">

            <div>
              <p className="dashboard-label">
                APPLICATIONS
              </p>

              <h1>
                My Applications
              </h1>

              <p>
                Track the jobs you have applied for and monitor
                your application status.
              </p>
            </div>

            <div className="application-count">
              <span>
                {applications.length}
              </span>

              <small>
                Applications
              </small>
            </div>

          </div>


          {/* Loading */}
          {loading && (
            <div className="applications-message">
              Loading your applications...
            </div>
          )}


          {/* Error */}
          {error && (
            <div className="applications-message error">
              {error}
            </div>
          )}


          {/* Empty State */}
          {!loading &&
            !error &&
            applications.length === 0 && (
              <div className="applications-empty">

                <div className="applications-empty-icon">
                  ▤
                </div>

                <h2>
                  No applications yet
                </h2>

                <p>
                  You haven't applied for any jobs yet.
                  Start exploring available opportunities.
                </p>

              </div>
            )
          }


          {/* Applications */}
          {!loading &&
            !error &&
            applications.length > 0 && (

              <div className="applications-list">

                {applications.map((application) => (

                  <div
                    className="application-card"
                    key={application.application_id}
                  >

                    {/* Company Logo */}
                    <div className="application-company-logo">

                      {application.company_name
                        ? application.company_name
                            .charAt(0)
                            .toUpperCase()
                        : "J"}

                    </div>


                    {/* Main Information */}
                    <div className="application-main">

                      <h2>
                        {application.job_title ||
                          application.title ||
                          "Job Title"}
                      </h2>

                      <p className="application-company">
                        {application.company_name ||
                          "Company"}
                      </p>

                      <div className="application-meta">

                        <span>
                          📍{" "}
                          {application.location ||
                            "Location not specified"}
                        </span>

                        <span>
                          💼{" "}
                          {application.employment_type ||
                            "N/A"}
                        </span>

                        <span>
                          📅 Applied{" "}
                          {formatDate(
                            application.applied_at
                          )}
                        </span>

                      </div>

                    </div>


                    {/* Status */}
                    <div className="application-status-section">

                      <span
                        className={getStatusClass(
                          application.status
                        )}
                      >
                        {formatStatus(
                          application.status
                        )}
                      </span>

                      <p>
                        Application ID: #
                        {application.application_id}
                      </p>

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

export default Applications;