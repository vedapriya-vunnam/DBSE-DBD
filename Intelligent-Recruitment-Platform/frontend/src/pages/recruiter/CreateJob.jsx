import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RecruiterSidebar from "../../components/RecruiterSidebar";
import "./CreateJob.css";

function CreateJob() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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
        status: "published",
        application_deadline: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:5000/api/jobs",
                {
                    ...formData,
                    salary_min: formData.salary_min
                        ? Number(formData.salary_min)
                        : null,
                    salary_max: formData.salary_max
                        ? Number(formData.salary_max)
                        : null,
                    experience_min: formData.experience_min
                        ? Number(formData.experience_min)
                        : null,
                    experience_max: formData.experience_max
                        ? Number(formData.experience_max)
                        : null,
                    openings: Number(formData.openings)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("CREATE JOB RESPONSE:", response.data);

            setMessage("Job created successfully!");

            setTimeout(() => {
                navigate("/recruiter/jobs");
            }, 1000);

        } catch (err) {
            console.error("Create job error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to create job"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recruiter-layout">

            <RecruiterSidebar />

            <main className="recruiter-main">

                <div className="create-job-page">

                    <div className="create-job-header">

                        <div>
                            <p className="page-label">
                                JOB POSTING
                            </p>

                            <h1>
                                Create a New Job
                            </h1>

                            <p>
                                Add the details of your new job opportunity.
                            </p>
                        </div>

                        <button
                            className="back-jobs-btn"
                            onClick={() => navigate("/recruiter/jobs")}
                        >
                            ← Back to My Jobs
                        </button>

                    </div>

                    <form
                        className="create-job-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-section">

                            <div className="section-heading">
                                <h2>Basic Information</h2>
                                <p>
                                    Provide the main details about the position.
                                </p>
                            </div>

                            <div className="form-group">

                                <label>
                                    Job Title *
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Frontend Developer Intern"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Job Description *
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the role, responsibilities and requirements..."
                                    rows="6"
                                    required
                                />

                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Employment Type *
                                    </label>

                                    <select
                                        name="employment_type"
                                        value={formData.employment_type}
                                        onChange={handleChange}
                                        required
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

                                <div className="form-group">

                                    <label>
                                        Work Mode *
                                    </label>

                                    <select
                                        name="work_mode"
                                        value={formData.work_mode}
                                        onChange={handleChange}
                                        required
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

                        </div>

                        <div className="form-section">

                            <div className="section-heading">
                                <h2>Location & Compensation</h2>
                                <p>
                                    Add the location and salary information.
                                </p>
                            </div>

                            <div className="form-group">

                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Hyderabad"
                                />

                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Minimum Salary
                                    </label>

                                    <input
                                        type="number"
                                        name="salary_min"
                                        value={formData.salary_min}
                                        onChange={handleChange}
                                        placeholder="12000"
                                        min="0"
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Maximum Salary
                                    </label>

                                    <input
                                        type="number"
                                        name="salary_max"
                                        value={formData.salary_max}
                                        onChange={handleChange}
                                        placeholder="22000"
                                        min="0"
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Currency
                                    </label>

                                    <select
                                        name="salary_currency"
                                        value={formData.salary_currency}
                                        onChange={handleChange}
                                    >
                                        <option value="INR">
                                            INR
                                        </option>

                                        <option value="USD">
                                            USD
                                        </option>

                                        <option value="EUR">
                                            EUR
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>

                        <div className="form-section">

                            <div className="section-heading">
                                <h2>Experience & Openings</h2>
                                <p>
                                    Specify the experience requirements and available positions.
                                </p>
                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Minimum Experience (Years)
                                    </label>

                                    <input
                                        type="number"
                                        name="experience_min"
                                        value={formData.experience_min}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Maximum Experience (Years)
                                    </label>

                                    <input
                                        type="number"
                                        name="experience_max"
                                        value={formData.experience_max}
                                        onChange={handleChange}
                                        placeholder="2"
                                        min="0"
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Number of Openings *
                                    </label>

                                    <input
                                        type="number"
                                        name="openings"
                                        value={formData.openings}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />

                                </div>

                            </div>

                        </div>

                        <div className="form-section">

                            <div className="section-heading">
                                <h2>Application Settings</h2>
                                <p>
                                    Control when and how the job is published.
                                </p>
                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Job Status
                                    </label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="published">
                                            Published
                                        </option>

                                        <option value="draft">
                                            Draft
                                        </option>

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Application Deadline
                                    </label>

                                    <input
                                        type="datetime-local"
                                        name="application_deadline"
                                        value={formData.application_deadline}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>

                        </div>

                        {message && (
                            <div className="success-message">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-job-btn"
                                onClick={() =>
                                    navigate("/recruiter/jobs")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="create-job-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating Job..."
                                    : "Create Job"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default CreateJob;