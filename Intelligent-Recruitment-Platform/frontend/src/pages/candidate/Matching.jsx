import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CandidateSidebar from "../../components/CandidateSidebar";
import "./Matching.css";

function Matching() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMatchingJobs();
  }, []);

  const fetchMatchingJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("MATCHING TOKEN EXISTS:", !!token);

      if (!token) {
        setError("Please login again to view job matches.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/matching/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("MATCHING JOBS RESPONSE:", response.data);

      const matchingJobs =
        response.data.jobs ||
        response.data.matchingJobs ||
        [];

      setJobs(matchingJobs);

    } catch (error) {
      console.error(
        "MATCHING JOBS ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to load matching jobs"
      );

    } finally {
      setLoading(false);
    }
  };

  const getMatchClass = (percentage) => {
    if (percentage >= 80) {
      return "match-high";
    }

    if (percentage >= 50) {
      return "match-medium";
    }

    return "match-low";
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

  return (
    <div className="candidate-layout">

      <CandidateSidebar />

      <main className="candidate-main">

        <div className="matching-page">

          <div className="matching-header">

            <div>

              <p className="dashboard-label">
                JOB MATCHING
              </p>

              <h1>
                Jobs matched for you
              </h1>

              <p>
                Discover opportunities based on your
                skills and profile.
              </p>

            </div>

            <div className="matching-count">

              <span>
                {jobs.length}
              </span>

              <small>
                Matched Jobs
              </small>

            </div>

          </div>


          {loading && (
            <div className="matching-message">
              Finding jobs that match your skills...
            </div>
          )}


          {!loading && error && (
            <div className="matching-message error">
              {error}
            </div>
          )}


          {!loading &&
            !error &&
            jobs.length === 0 && (

              <div className="matching-empty">

                <div className="matching-empty-icon">
                  ✦
                </div>

                <h2>
                  No matching jobs found
                </h2>

                <p>
                  No current jobs match your skills.
                  Check your profile and skills to improve
                  your matches.
                </p>

                <button
                  onClick={() =>
                    navigate("/candidate/profile")
                  }
                >
                  Update Profile
                  <span>→</span>
                </button>

              </div>
            )
          }


          {!loading &&
            !error &&
            jobs.length > 0 && (

              <div className="matching-list">

                {jobs.map((job) => (

                  <div
                    className="matching-card"
                    key={job.job_id}
                  >

                    <div className="matching-card-top">

                      <div className="matching-company-logo">

                        {job.company_name
                          ? job.company_name
                              .charAt(0)
                              .toUpperCase()
                          : "J"}

                      </div>


                      <div className="matching-job-info">

                        <h2>
                          {job.title}
                        </h2>

                        <p className="matching-company">
                          {job.company_name || "Company"}
                        </p>

                        <div className="matching-meta">

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

                      </div>


                      <div
                        className={`match-percentage ${getMatchClass(
                          job.match_percentage
                        )}`}
                      >

                        <strong>
                          {job.match_percentage}%
                        </strong>

                        <span>
                          Match
                        </span>

                      </div>

                    </div>


                    <div className="match-progress-section">

                      <div className="match-progress-label">

                        <span>
                          Skill Match
                        </span>

                        <strong>
                          {job.match_percentage}%
                        </strong>

                      </div>

                      <div className="match-progress">

                        <div
                          className={`match-progress-fill ${getMatchClass(
                            job.match_percentage
                          )}`}
                          style={{
                            width: `${job.match_percentage}%`
                          }}
                        />

                      </div>

                    </div>


                    <div className="matching-skills">

                      <div>

                        <p>
                          Matched Skills
                        </p>

                        <div className="skill-tags">

                          {job.matched_skills &&
                          job.matched_skills.length > 0 ? (

                            job.matched_skills.map(
                              (skill) => (
                                <span
                                  className="matched-skill"
                                  key={skill}
                                >
                                  ✓ {skill}
                                </span>
                              )
                            )

                          ) : (

                            <span className="no-skills">
                              No matched skills
                            </span>

                          )}

                        </div>

                      </div>


                      {job.missing_skills &&
                        job.missing_skills.length > 0 && (

                          <div>

                            <p>
                              Skills to Develop
                            </p>

                            <div className="skill-tags">

                              {job.missing_skills.map(
                                (skill) => (
                                  <span
                                    className="missing-skill"
                                    key={skill}
                                  >
                                    + {skill}
                                  </span>
                                )
                              )}

                            </div>

                          </div>

                        )}

                    </div>


                    <div className="matching-card-bottom">

                      <div className="matching-salary">

                        ₹
                        {Number(
                          job.salary_min || 0
                        ).toLocaleString("en-IN")}

                        {" - "}

                        ₹
                        {Number(
                          job.salary_max || 0
                        ).toLocaleString("en-IN")}

                      </div>

                      <button
                        className="view-match-button"
                        onClick={() =>
                          navigate(
                            `/candidate/jobs/${job.job_id}`
                          )
                        }
                      >
                        View Job
                        <span>→</span>
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

export default Matching;