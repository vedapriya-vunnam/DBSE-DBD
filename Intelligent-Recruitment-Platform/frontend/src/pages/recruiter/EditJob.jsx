import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import RecruiterSidebar from "../../components/RecruiterSidebar";
import "./EditJob.css";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    employment_type: "full_time",
    work_mode: "onsite",
    location: "",
    salary_min: "",
    salary_max: "",
    salary_currency: "INR",
    experience_min: "",
    experience_max: "",
    openings: 1,
    application_deadline: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/jobs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const job = response.data.job;

      setForm({
        title: job.title || "",
        description: job.description || "",
        employment_type: job.employment_type || "full_time",
        work_mode: job.work_mode || "onsite",
        location: job.location || "",
        salary_min: job.salary_min || "",
        salary_max: job.salary_max || "",
        salary_currency: job.salary_currency || "INR",
        experience_min: job.experience_min ?? "",
        experience_max: job.experience_max ?? "",
        openings: job.openings || 1,
        application_deadline: job.application_deadline
          ? new Date(job.application_deadline)
              .toISOString()
              .slice(0, 16)
          : ""
      });

    } catch (error) {
      console.error(
        "EDIT JOB LOAD ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to load job"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5000/api/jobs/${id}`,
        {
          title: form.title,
          description: form.description,
          employment_type: form.employment_type,
          work_mode: form.work_mode,
          location: form.location,
          salary_min: form.salary_min
            ? Number(form.salary_min)
            : null,
          salary_max: form.salary_max
            ? Number(form.salary_max)
            : null,
          salary_currency: form.salary_currency,
          experience_min: form.experience_min !== ""
            ? Number(form.experience_min)
            : null,
          experience_max: form.experience_max !== ""
            ? Number(form.experience_max)
            : null,
          openings: Number(form.openings),
          application_deadline:
            form.application_deadline || null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "UPDATE JOB RESPONSE:",
        response.data
      );

      setMessage(
        response.data.message ||
        "Job updated successfully!"
      );

      setTimeout(() => {
        navigate(`/recruiter/jobs/${id}`);
      }, 800);

    } catch (error) {
      console.error(
        "UPDATE JOB ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to update job"
      );

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="recruiter-layout">

        <RecruiterSidebar />

        <main className="recruiter-main">

          <div className="edit-job-message">
            Loading job...
          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="recruiter-layout">

      <RecruiterSidebar />

      <main className="recruiter-main">

        <div className="edit-job-page">

          <button
            className="edit-back-button"
            onClick={() =>
              navigate(`/recruiter/jobs/${id}`)
            }
          >
            ← Back to Job
          </button>


          <div className="edit-job-header">

            <div>

              <p className="dashboard-label">
                JOB MANAGEMENT
              </p>

              <h1>
                Edit Job
              </h1>

              <p>
                Update the details of your job posting.
              </p>

            </div>

          </div>


          {error && (
            <div className="edit-job-message error">
              {error}
            </div>
          )}

          {message && (
            <div className="edit-job-message success">
              {message}
            </div>
          )}


          <form
            className="edit-job-form"
            onSubmit={handleSubmit}
          >

            <section className="edit-job-section">

              <h2>
                Basic Information
              </h2>

              <div className="edit-field">

                <label>
                  Job Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="edit-field">

                <label>
                  Job Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="6"
                  required
                />

              </div>


              <div className="edit-grid">

                <div className="edit-field">

                  <label>
                    Employment Type
                  </label>

                  <select
                    name="employment_type"
                    value={form.employment_type}
                    onChange={handleChange}
                  >
                    <option value="full_time">
                      Full Time
                    </option>

                    <option value="part_time">
                      Part Time
                    </option>

                    <option value="internship">
                      Internship
                    </option>

                    <option value="contract">
                      Contract
                    </option>
                  </select>

                </div>


                <div className="edit-field">

                  <label>
                    Work Mode
                  </label>

                  <select
                    name="work_mode"
                    value={form.work_mode}
                    onChange={handleChange}
                  >
                    <option value="onsite">
                      Onsite
                    </option>

                    <option value="remote">
                      Remote
                    </option>

                    <option value="hybrid">
                      Hybrid
                    </option>
                  </select>

                </div>

              </div>


              <div className="edit-field">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                />

              </div>

            </section>


            <section className="edit-job-section">

              <h2>
                Compensation & Experience
              </h2>

              <div className="edit-grid">

                <div className="edit-field">

                  <label>
                    Minimum Salary
                  </label>

                  <input
                    type="number"
                    name="salary_min"
                    value={form.salary_min}
                    onChange={handleChange}
                    min="0"
                  />

                </div>


                <div className="edit-field">

                  <label>
                    Maximum Salary
                  </label>

                  <input
                    type="number"
                    name="salary_max"
                    value={form.salary_max}
                    onChange={handleChange}
                    min="0"
                  />

                </div>

              </div>


              <div className="edit-grid">

                <div className="edit-field">

                  <label>
                    Minimum Experience
                  </label>

                  <input
                    type="number"
                    name="experience_min"
                    value={form.experience_min}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                  />

                </div>


                <div className="edit-field">

                  <label>
                    Maximum Experience
                  </label>

                  <input
                    type="number"
                    name="experience_max"
                    value={form.experience_max}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                  />

                </div>

              </div>


              <div className="edit-field">

                <label>
                  Number of Openings
                </label>

                <input
                  type="number"
                  name="openings"
                  value={form.openings}
                  onChange={handleChange}
                  min="1"
                  required
                />

              </div>

            </section>


            <section className="edit-job-section">

              <h2>
                Application Deadline
              </h2>

              <div className="edit-field">

                <label>
                  Deadline
                </label>

                <input
                  type="datetime-local"
                  name="application_deadline"
                  value={form.application_deadline}
                  onChange={handleChange}
                />

              </div>

            </section>


            <div className="edit-job-actions">

              <button
                type="button"
                className="cancel-edit-button"
                onClick={() =>
                  navigate(`/recruiter/jobs/${id}`)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-job-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default EditJob;