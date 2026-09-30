import { useEffect, useState } from "react";
import axios from "axios";
import RecruiterSidebar from "../../components/RecruiterSidebar";
import "./Applications.css";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // View Application
    const [viewApplication, setViewApplication] = useState(null);

    // Update Status
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [updating, setUpdating] = useState(false);

    // Schedule Interview
    const [selectedInterviewApplication, setSelectedInterviewApplication] =
        useState(null);

    const [interviewData, setInterviewData] = useState({
        interview_type: "online",
        scheduled_at: "",
        duration_minutes: 30,
        meeting_link: "",
        location: "",
        interviewer_name: "",
        notes: ""
    });

    const [schedulingInterview, setSchedulingInterview] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login again.");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/api/applications/recruiter/applications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "RECRUITER APPLICATIONS:",
                response.data
            );

            setApplications(
                response.data.applications || []
            );

        } catch (err) {
            console.error(
                "Error fetching applications:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load applications"
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // VIEW APPLICATION
    // =========================

    const openViewApplication = (application) => {
        setViewApplication(application);
    };

    const closeViewApplication = () => {
        setViewApplication(null);
    };

    // =========================
    // UPDATE APPLICATION STATUS
    // =========================

    const openStatusModal = (application) => {
        setSelectedApplication(application);
        setNewStatus(application.status);
    };

    const closeStatusModal = () => {
        setSelectedApplication(null);
        setNewStatus("");
    };

    const updateStatus = async () => {
        if (!selectedApplication || !newStatus) {
            return;
        }

        try {
            setUpdating(true);

            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:5000/api/applications/${selectedApplication.application_id}/status`,
                {
                    status: newStatus
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(
                "Application status updated successfully!"
            );

            closeStatusModal();

            await fetchApplications();

        } catch (err) {
            console.error(
                "Status update error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to update application status"
            );

        } finally {
            setUpdating(false);
        }
    };

    // =========================
    // SCHEDULE INTERVIEW
    // =========================

    const openInterviewModal = (application) => {
        setSelectedInterviewApplication(application);

        setInterviewData({
            interview_type: "online",
            scheduled_at: "",
            duration_minutes: 30,
            meeting_link: "",
            location: "",
            interviewer_name: "",
            notes: ""
        });
    };

    const closeInterviewModal = () => {
        setSelectedInterviewApplication(null);

        setInterviewData({
            interview_type: "online",
            scheduled_at: "",
            duration_minutes: 30,
            meeting_link: "",
            location: "",
            interviewer_name: "",
            notes: ""
        });
    };

    const handleInterviewChange = (e) => {
        const { name, value } = e.target;

        setInterviewData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const scheduleInterview = async (e) => {
        e.preventDefault();

        if (!selectedInterviewApplication) {
            return;
        }

        try {
            setSchedulingInterview(true);

            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5000/api/interviews",
                {
                    application_id:
                        selectedInterviewApplication.application_id,

                    interview_type:
                        interviewData.interview_type,

                    scheduled_at:
                        interviewData.scheduled_at,

                    duration_minutes:
                        Number(
                            interviewData.duration_minutes
                        ),

                    meeting_link:
                        interviewData.meeting_link ||
                        null,

                    location:
                        interviewData.location ||
                        null,

                    interviewer_name:
                        interviewData.interviewer_name ||
                        null,

                    notes:
                        interviewData.notes ||
                        null
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(
                "Interview scheduled successfully!"
            );

            closeInterviewModal();

            await fetchApplications();

        } catch (err) {
            console.error(
                "SCHEDULE INTERVIEW ERROR:",
                err.response?.data ||
                err.message
            );

            alert(
                err.response?.data?.message ||
                "Failed to schedule interview"
            );

        } finally {
            setSchedulingInterview(false);
        }
    };

    const getStatusClass = (status) => {
        return `application-status ${status}`;
    };

    return (
        <div className="recruiter-layout">

            <RecruiterSidebar />

            <main className="recruiter-main">

                <div className="recruiter-applications">

                    {/* HEADER */}

                    <div className="applications-header">

                        <div>

                            <p className="page-label">
                                APPLICATIONS
                            </p>

                            <h1>
                                Candidate Applications
                            </h1>

                            <p>
                                Review applications received for your job postings.
                            </p>

                        </div>

                        <div className="application-count">
                            {applications.length} Applications
                        </div>

                    </div>

                    {/* LOADING */}

                    {loading && (
                        <div className="applications-message">
                            Loading applications...
                        </div>
                    )}

                    {/* ERROR */}

                    {error && (
                        <div className="applications-error">
                            {error}
                        </div>
                    )}

                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        applications.length === 0 && (

                            <div className="applications-empty">

                                <h3>
                                    No applications yet
                                </h3>

                                <p>
                                    Applications from candidates will appear here.
                                </p>

                            </div>
                        )}

                    {/* APPLICATIONS */}

                    {!loading &&
                        !error &&
                        applications.length > 0 && (

                            <div className="applications-list">

                                {applications.map(
                                    (application) => (

                                        <div
                                            className="application-card"
                                            key={
                                                application.application_id
                                            }
                                        >

                                            {/* CANDIDATE AVATAR */}

                                            <div className="candidate-avatar">

                                                {application.candidate_name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() ||
                                                    "C"}

                                            </div>

                                            <div className="application-content">

                                                {/* TOP */}

                                                <div className="application-top">

                                                    <div>

                                                        <h2>
                                                            {
                                                                application.candidate_name
                                                            }
                                                        </h2>

                                                        <p className="candidate-email">
                                                            {
                                                                application.candidate_email
                                                            }
                                                        </p>

                                                    </div>

                                                    <span
                                                        className={getStatusClass(
                                                            application.status
                                                        )}
                                                    >
                                                        {application.status
                                                            ?.replace(
                                                                "_",
                                                                " "
                                                            )
                                                            .replace(
                                                                /\b\w/g,
                                                                (char) =>
                                                                    char.toUpperCase()
                                                            )}
                                                    </span>

                                                </div>

                                                {/* JOB */}

                                                <div className="job-applied">

                                                    <span>
                                                        Applied for
                                                    </span>

                                                    <strong>
                                                        {
                                                            application.job_title
                                                        }
                                                    </strong>

                                                </div>

                                                {/* INFO */}

                                                <div className="application-info">

                                                    <div>

                                                        <span>
                                                            Application ID
                                                        </span>

                                                        <strong>
                                                            #
                                                            {
                                                                application.application_id
                                                            }
                                                        </strong>

                                                    </div>

                                                    <div>

                                                        <span>
                                                            Applied On
                                                        </span>

                                                        <strong>
                                                            {application.applied_at
                                                                ? new Date(
                                                                      application.applied_at
                                                                  ).toLocaleDateString(
                                                                      "en-IN",
                                                                      {
                                                                          day: "2-digit",
                                                                          month: "short",
                                                                          year: "numeric"
                                                                      }
                                                                  )
                                                                : "N/A"}
                                                        </strong>

                                                    </div>

                                                    <div>

                                                        <span>
                                                            Job Location
                                                        </span>

                                                        <strong>
                                                            {
                                                                application.location ||
                                                                "Not specified"
                                                            }
                                                        </strong>

                                                    </div>

                                                </div>

                                                {/* COVER LETTER */}

                                                {application.cover_letter && (

                                                    <div className="cover-letter">

                                                        <span>
                                                            Cover Letter
                                                        </span>

                                                        <p>
                                                            {
                                                                application.cover_letter
                                                            }
                                                        </p>

                                                    </div>

                                                )}

                                                {/* ACTIONS */}

                                                <div className="application-actions">

                                                    <button
                                                        className="view-application-btn"
                                                        onClick={() =>
                                                            openViewApplication(
                                                                application
                                                            )
                                                        }
                                                    >
                                                        View Application
                                                    </button>

                                                    <button
                                                        className="status-btn"
                                                        onClick={() =>
                                                            openStatusModal(
                                                                application
                                                            )
                                                        }
                                                    >
                                                        Update Status
                                                    </button>

                                                    <button
                                                        className="schedule-interview-button"
                                                        onClick={() =>
                                                            openInterviewModal(
                                                                application
                                                            )
                                                        }
                                                    >
                                                        Schedule Interview
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </div>

            </main>

            {/* ========================= */}
            {/* VIEW APPLICATION MODAL */}
            {/* ========================= */}

            {viewApplication && (

                <div className="status-modal-overlay">

                    <div className="status-modal application-details-modal">

                        <button
                            type="button"
                            className="modal-close"
                            onClick={
                                closeViewApplication
                            }
                        >
                            ×
                        </button>

                        <p className="page-label">
                            APPLICATION DETAILS
                        </p>

                        <h2>
                            Candidate Application
                        </h2>

                        <p className="modal-description">
                            Review the complete application details below.
                        </p>

                        {/* CANDIDATE INFORMATION */}

                        <div className="application-detail-section">

                            <h3>
                                Candidate Information
                            </h3>

                            <div className="application-detail-grid">

                                <div className="application-detail-item">

                                    <span>
                                        Candidate Name
                                    </span>

                                    <strong>
                                        {
                                            viewApplication.candidate_name ||
                                            "N/A"
                                        }
                                    </strong>

                                </div>

                                <div className="application-detail-item">

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {
                                            viewApplication.candidate_email ||
                                            "N/A"
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* JOB INFORMATION */}

                        <div className="application-detail-section">

                            <h3>
                                Job Information
                            </h3>

                            <div className="application-detail-grid">

                                <div className="application-detail-item">

                                    <span>
                                        Applied For
                                    </span>

                                    <strong>
                                        {
                                            viewApplication.job_title ||
                                            "N/A"
                                        }
                                    </strong>

                                </div>

                                <div className="application-detail-item">

                                    <span>
                                        Job Location
                                    </span>

                                    <strong>
                                        {
                                            viewApplication.location ||
                                            "Not specified"
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* APPLICATION INFORMATION */}

                        <div className="application-detail-section">

                            <h3>
                                Application Information
                            </h3>

                            <div className="application-detail-grid">

                                <div className="application-detail-item">

                                    <span>
                                        Application ID
                                    </span>

                                    <strong>
                                        #
                                        {
                                            viewApplication.application_id
                                        }
                                    </strong>

                                </div>

                                <div className="application-detail-item">

                                    <span>
                                        Applied On
                                    </span>

                                    <strong>
                                        {viewApplication.applied_at
                                            ? new Date(
                                                  viewApplication.applied_at
                                              ).toLocaleDateString(
                                                  "en-IN",
                                                  {
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric"
                                                  }
                                              )
                                            : "N/A"}
                                    </strong>

                                </div>

                                <div className="application-detail-item">

                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        {viewApplication.status
                                            ?.replace("_", " ")
                                            .replace(
                                                /\b\w/g,
                                                (char) =>
                                                    char.toUpperCase()
                                            ) ||
                                            "N/A"}
                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* COVER LETTER */}

                        {viewApplication.cover_letter && (

                            <div className="application-detail-section">

                                <h3>
                                    Cover Letter
                                </h3>

                                <div className="application-detail-cover">

                                    {
                                        viewApplication.cover_letter
                                    }

                                </div>

                            </div>

                        )}

                        {/* ACTIONS */}

                        <div className="modal-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={
                                    closeViewApplication
                                }
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                className="confirm-status-btn"
                                onClick={() => {

                                    setSelectedApplication(
                                        viewApplication
                                    );

                                    setNewStatus(
                                        viewApplication.status
                                    );

                                    setViewApplication(null);

                                }}
                            >
                                Update Status
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* ========================= */}
            {/* UPDATE STATUS MODAL */}
            {/* ========================= */}

            {selectedApplication && (

                <div className="status-modal-overlay">

                    <div className="status-modal">

                        <button
                            className="modal-close"
                            onClick={
                                closeStatusModal
                            }
                        >
                            ×
                        </button>

                        <p className="page-label">
                            UPDATE APPLICATION
                        </p>

                        <h2>
                            Update Status
                        </h2>

                        <p className="modal-description">

                            Change the application status for{" "}

                            <strong>
                                {
                                    selectedApplication.candidate_name
                                }
                            </strong>

                        </p>

                        <label>
                            Application Status
                        </label>

                        <select
                            value={newStatus}
                            onChange={(e) =>
                                setNewStatus(
                                    e.target.value
                                )
                            }
                        >

                            <option value="applied">
                                Applied
                            </option>

                            <option value="under_review">
                                Under Review
                            </option>

                            <option value="shortlisted">
                                Shortlisted
                            </option>

                            <option value="interview">
                                Interview
                            </option>

                            <option value="selected">
                                Selected
                            </option>

                            <option value="rejected">
                                Rejected
                            </option>

                            <option value="withdrawn">
                                Withdrawn
                            </option>

                        </select>

                        <div className="modal-actions">

                            <button
                                className="cancel-btn"
                                onClick={
                                    closeStatusModal
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="confirm-status-btn"
                                onClick={
                                    updateStatus
                                }
                                disabled={updating}
                            >
                                {updating
                                    ? "Updating..."
                                    : "Update Status"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* ========================= */}
            {/* SCHEDULE INTERVIEW MODAL */}
            {/* ========================= */}

            {selectedInterviewApplication && (

                <div className="status-modal-overlay">

                    <div className="status-modal interview-modal">

                        <button
                            type="button"
                            className="modal-close"
                            onClick={
                                closeInterviewModal
                            }
                        >
                            ×
                        </button>

                        <p className="page-label">
                            INTERVIEW
                        </p>

                        <h2>
                            Schedule Interview
                        </h2>

                        <p className="modal-description">

                            Schedule an interview for{" "}

                            <strong>
                                {
                                    selectedInterviewApplication.candidate_name
                                }
                            </strong>

                        </p>

                        <div className="interview-job-name">

                            <span>
                                Job
                            </span>

                            <strong>
                                {
                                    selectedInterviewApplication.job_title
                                }
                            </strong>

                        </div>

                        <form
                            onSubmit={
                                scheduleInterview
                            }
                        >

                            {/* TYPE + DURATION */}

                            <div className="interview-form-row">

                                <div className="interview-form-group">

                                    <label>
                                        Interview Type
                                    </label>

                                    <select
                                        name="interview_type"
                                        value={
                                            interviewData.interview_type
                                        }
                                        onChange={
                                            handleInterviewChange
                                        }
                                        required
                                    >

                                        <option value="online">
                                            Online
                                        </option>

                                        <option value="phone">
                                            Phone
                                        </option>

                                        <option value="in_person">
                                            In Person
                                        </option>

                                    </select>

                                </div>

                                <div className="interview-form-group">

                                    <label>
                                        Duration
                                    </label>

                                    <select
                                        name="duration_minutes"
                                        value={
                                            interviewData.duration_minutes
                                        }
                                        onChange={
                                            handleInterviewChange
                                        }
                                    >

                                        <option value="15">
                                            15 minutes
                                        </option>

                                        <option value="30">
                                            30 minutes
                                        </option>

                                        <option value="45">
                                            45 minutes
                                        </option>

                                        <option value="60">
                                            60 minutes
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* DATE */}

                            <div className="interview-form-group">

                                <label>
                                    Date & Time
                                </label>

                                <input
                                    type="datetime-local"
                                    name="scheduled_at"
                                    value={
                                        interviewData.scheduled_at
                                    }
                                    onChange={
                                        handleInterviewChange
                                    }
                                    required
                                />

                            </div>

                            {/* MEETING LINK */}

                            <div className="interview-form-group">

                                <label>
                                    Meeting Link
                                </label>

                                <input
                                    type="url"
                                    name="meeting_link"
                                    value={
                                        interviewData.meeting_link
                                    }
                                    onChange={
                                        handleInterviewChange
                                    }
                                    placeholder="https://meet.example.com/..."
                                />

                            </div>

                            {/* LOCATION */}

                            <div className="interview-form-group">

                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={
                                        interviewData.location
                                    }
                                    onChange={
                                        handleInterviewChange
                                    }
                                    placeholder="Office location"
                                />

                            </div>

                            {/* INTERVIEWER */}

                            <div className="interview-form-group">

                                <label>
                                    Interviewer Name
                                </label>

                                <input
                                    type="text"
                                    name="interviewer_name"
                                    value={
                                        interviewData.interviewer_name
                                    }
                                    onChange={
                                        handleInterviewChange
                                    }
                                    placeholder="Enter interviewer name"
                                />

                            </div>

                            {/* NOTES */}

                            <div className="interview-form-group">

                                <label>
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={
                                        interviewData.notes
                                    }
                                    onChange={
                                        handleInterviewChange
                                    }
                                    rows="3"
                                    placeholder="Additional interview notes..."
                                />

                            </div>

                            {/* ACTIONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={
                                        closeInterviewModal
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="confirm-status-btn"
                                    disabled={
                                        schedulingInterview
                                    }
                                >
                                    {schedulingInterview
                                        ? "Scheduling..."
                                        : "Schedule Interview"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Applications;