import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    const [searchData, setSearchData] = useState({
        keyword: "",
        location: ""
    });

    const [searching, setSearching] = useState(false);

    // ================= FEATURED JOBS =================

    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [jobsError, setJobsError] = useState("");

    useEffect(() => {
        fetchFeaturedJobs();
    }, []);

    const fetchFeaturedJobs = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/jobs/search"
            );

            const jobs = response.data.jobs || [];

            // Show only the first 3 real published jobs
            setFeaturedJobs(jobs.slice(0, 3));

        } catch (error) {
            console.error(
                "FEATURED JOBS ERROR:",
                error.response?.data || error.message
            );

            setJobsError("Unable to load jobs right now.");
        } finally {
            setJobsLoading(false);
        }
    };

    // ================= SEARCH =================

    const handleSearchChange = (e) => {
        const { name, value } = e.target;

        setSearchData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (
            !searchData.keyword.trim() &&
            !searchData.location.trim()
        ) {
            navigate("/candidate/jobs");
            return;
        }

        try {
            setSearching(true);

            const params = {};

            if (searchData.keyword.trim()) {
                params.keyword = searchData.keyword.trim();
            }

            if (searchData.location.trim()) {
                params.location = searchData.location.trim();
            }

            const response = await axios.get(
                "http://localhost:5000/api/jobs/search",
                {
                    params
                }
            );

            sessionStorage.setItem(
                "homeJobSearchResults",
                JSON.stringify(
                    response.data.jobs ||
                    response.data.data ||
                    []
                )
            );

            sessionStorage.setItem(
                "homeJobSearchKeyword",
                searchData.keyword
            );

            sessionStorage.setItem(
                "homeJobSearchLocation",
                searchData.location
            );

            navigate("/candidate/jobs");

        } catch (err) {
            console.error(
                "HOME JOB SEARCH ERROR:",
                err.response?.data || err.message
            );

            navigate("/candidate/jobs");

        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="home-page">

            {/* ================= NAVBAR ================= */}

            <nav className="home-navbar">

                <div
                    className="home-logo"
                    onClick={() => navigate("/")}
                >
                    <div className="logo-icon">
                        IR
                    </div>

                    <span>
                        Intelli<span>Recruit</span>
                    </span>
                </div>

                <div className="home-nav-links">

                    <button
                        onClick={() => navigate("/")}
                        className="active"
                    >
                        Home
                    </button>

                    <button
                        onClick={() =>
                            navigate("/candidate/jobs")
                        }
                    >
                        Find Jobs
                    </button>

                    <button
                        onClick={() =>
                            document
                                .getElementById("how-it-works")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                })
                        }
                    >
                        How It Works
                    </button>

                    <button
                        onClick={() =>
                            document
                                .getElementById("features")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                })
                        }
                    >
                        Features
                    </button>

                </div>

                <div className="home-nav-actions">

                    <button
                        className="login-button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>

                    <button
                        className="register-button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Get Started
                    </button>

                </div>

            </nav>


            {/* ================= HERO ================= */}

            <section className="hero-section">

                <div className="hero-background-shape shape-one"></div>
                <div className="hero-background-shape shape-two"></div>

                <div className="hero-content">

                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        Smart recruitment, simplified
                    </div>

                    <h1>
                        Find the right
                        <br />
                        <span>opportunity.</span>
                    </h1>

                    <p className="hero-description">
                        Discover opportunities that match your
                        skills and career goals. Connect with
                        employers and take the next step in your
                        professional journey.
                    </p>

                    <div className="hero-buttons">

                        <button
                            className="hero-primary-button"
                            onClick={() =>
                                navigate("/candidate/jobs")
                            }
                        >
                            Explore Jobs
                            <span>→</span>
                        </button>

                        <button
                            className="hero-secondary-button"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Create Account
                        </button>

                    </div>

                </div>

                <div className="hero-visual">

                    <div className="hero-card main-hero-card">

                        <div className="hero-card-header">

                            <div className="hero-card-icon">
                                ✓
                            </div>

                            <div>
                                <span>
                                    Your next opportunity
                                </span>

                                <strong>
                                    starts here
                                </strong>
                            </div>

                        </div>

                        <div className="hero-progress">

                            <div className="progress-label">
                                <span>
                                    Profile readiness
                                </span>

                                <strong>
                                    85%
                                </strong>
                            </div>

                            <div className="progress-bar">
                                <div></div>
                            </div>

                        </div>

                        <div className="hero-mini-items">

                            <div>
                                <span className="mini-check">
                                    ✓
                                </span>
                                Skills
                            </div>

                            <div>
                                <span className="mini-check">
                                    ✓
                                </span>
                                Experience
                            </div>

                            <div>
                                <span className="mini-check">
                                    ✓
                                </span>
                                Preferences
                            </div>

                        </div>

                    </div>

                    <div className="floating-card floating-card-one">

                        <div className="floating-icon">
                            ✦
                        </div>

                        <div>
                            <strong>
                                Smart Matching
                            </strong>

                            <span>
                                Find relevant jobs
                            </span>
                        </div>

                    </div>

                    <div className="floating-card floating-card-two">

                        <div className="floating-icon green">
                            ✓
                        </div>

                        <div>
                            <strong>
                                Easy Applications
                            </strong>

                            <span>
                                Apply in minutes
                            </span>
                        </div>

                    </div>

                </div>

            </section>


            {/* ================= SEARCH ================= */}

            <section className="search-section">

                <div className="search-container">

                    <div className="search-heading">
                        <span>START YOUR SEARCH</span>

                        <h2>
                            Find opportunities that fit you
                        </h2>
                    </div>

                    <form
                        className="job-search-box"
                        onSubmit={handleSearch}
                    >

                        <div className="search-field">

                            <div className="search-field-icon">
                                ⌕
                            </div>

                            <div>
                                <label>
                                    What are you looking for?
                                </label>

                                <input
                                    type="text"
                                    name="keyword"
                                    placeholder="Job title, skills or keywords"
                                    value={searchData.keyword}
                                    onChange={handleSearchChange}
                                />
                            </div>

                        </div>

                        <div className="search-divider"></div>

                        <div className="search-field">

                            <div className="search-field-icon">
                                ◉
                            </div>

                            <div>
                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    placeholder="City or location"
                                    value={searchData.location}
                                    onChange={handleSearchChange}
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="search-button"
                            disabled={searching}
                        >
                            {searching
                                ? "Searching..."
                                : "Search Jobs"}
                        </button>

                    </form>

                </div>

            </section>


            {/* ================= FEATURED JOBS ================= */}

            <section className="featured-jobs-section">

                <div className="section-heading">

                    <span>
                        LATEST OPPORTUNITIES
                    </span>

                    <h2>
                        Explore featured jobs
                    </h2>

                    <p>
                        Discover the latest opportunities available
                        on IntelliRecruit.
                    </p>

                </div>

                {jobsLoading && (
                    <div className="featured-jobs-message">
                        Loading available jobs...
                    </div>
                )}

                {!jobsLoading && jobsError && (
                    <div className="featured-jobs-message error">
                        {jobsError}
                    </div>
                )}

                {!jobsLoading &&
                    !jobsError &&
                    featuredJobs.length === 0 && (
                        <div className="featured-jobs-message">
                            No published jobs are available right now.
                        </div>
                    )}

                {!jobsLoading &&
                    !jobsError &&
                    featuredJobs.length > 0 && (

                        <div className="featured-jobs-grid">

                            {featuredJobs.map((job) => (

                                <div
                                    className="featured-job-card"
                                    key={job.job_id}
                                >

                                    <div className="featured-job-top">

                                        <div className="featured-company-logo">
                                            {job.company_name
                                                ? job.company_name
                                                    .charAt(0)
                                                    .toUpperCase()
                                                : "J"}
                                        </div>

                                        <span className="featured-job-type">
                                            {job.employment_type}
                                        </span>

                                    </div>

                                    <h3>
                                        {job.title}
                                    </h3>

                                    <p className="featured-company">
                                        {job.company_name}
                                    </p>

                                    <div className="featured-job-details">

                                        <span>
                                            📍 {job.location ||
                                                "Location not specified"}
                                        </span>

                                        <span>
                                            💼 {job.work_mode}
                                        </span>

                                    </div>

                                    {(job.salary_min ||
                                        job.salary_max) && (

                                        <p className="featured-salary">

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
                                        className="featured-view-button"
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

                            ))}

                        </div>
                    )}

                {!jobsLoading &&
                    featuredJobs.length > 0 && (

                        <div className="featured-jobs-footer">

                            <button
                                className="view-all-jobs-button"
                                onClick={() =>
                                    navigate("/candidate/jobs")
                                }
                            >
                                View All Jobs
                                <span>→</span>
                            </button>

                        </div>

                    )}

            </section>


            {/* ================= FEATURES ================= */}

            <section
                className="features-section"
                id="features"
            >

                <div className="section-heading">

                    <span>
                        WHY INTELLIRECRUIT
                    </span>

                    <h2>
                        Everything you need to move forward
                    </h2>

                    <p>
                        A smarter recruitment experience for
                        candidates and recruiters.
                    </p>

                </div>

                <div className="features-grid">

                    <div className="feature-card">

                        <div className="feature-icon purple">
                            ✦
                        </div>

                        <h3>
                            Smart Job Matching
                        </h3>

                        <p>
                            Discover relevant opportunities based
                            on your skills and profile.
                        </p>

                    </div>

                    <div className="feature-card">

                        <div className="feature-icon blue">
                            ↗
                        </div>

                        <h3>
                            Simple Applications
                        </h3>

                        <p>
                            Apply for jobs and keep track of your
                            applications from one place.
                        </p>

                    </div>

                    <div className="feature-card">

                        <div className="feature-icon green">
                            ◷
                        </div>

                        <h3>
                            Interview Management
                        </h3>

                        <p>
                            Manage interview schedules, details
                            and status without the hassle.
                        </p>

                    </div>

                    <div className="feature-card">

                        <div className="feature-icon orange">
                            ♢
                        </div>

                        <h3>
                            Real-time Notifications
                        </h3>

                        <p>
                            Stay informed about application and
                            interview updates.
                        </p>

                    </div>

                </div>

            </section>


            {/* ================= HOW IT WORKS ================= */}

            <section
                className="how-section"
                id="how-it-works"
            >

                <div className="section-heading">

                    <span>
                        HOW IT WORKS
                    </span>

                    <h2>
                        From opportunity to interview
                    </h2>

                    <p>
                        A simple process designed to keep your
                        recruitment journey organized.
                    </p>

                </div>

                <div className="steps-container">

                    <div className="step">

                        <div className="step-number">
                            01
                        </div>

                        <div className="step-line"></div>

                        <h3>
                            Create your profile
                        </h3>

                        <p>
                            Build your candidate profile with your
                            skills, education and experience.
                        </p>

                    </div>

                    <div className="step">

                        <div className="step-number">
                            02
                        </div>

                        <div className="step-line"></div>

                        <h3>
                            Find opportunities
                        </h3>

                        <p>
                            Search published jobs and discover
                            opportunities that match your profile.
                        </p>

                    </div>

                    <div className="step">

                        <div className="step-number">
                            03
                        </div>

                        <div className="step-line"></div>

                        <h3>
                            Apply & connect
                        </h3>

                        <p>
                            Submit applications and stay updated
                            as recruiters review your profile.
                        </p>

                    </div>

                    <div className="step">

                        <div className="step-number">
                            04
                        </div>

                        <h3>
                            Manage interviews
                        </h3>

                        <p>
                            Receive interview notifications and
                            manage your interview details easily.
                        </p>

                    </div>

                </div>

            </section>


            {/* ================= RECRUITER CTA ================= */}

            <section className="recruiter-section">

                <div className="recruiter-content">

                    <span>
                        FOR RECRUITERS
                    </span>

                    <h2>
                        Find the people who can
                        <br />
                        move your team forward.
                    </h2>

                    <p>
                        Create jobs, manage applications,
                        schedule interviews and connect with
                        candidates through one platform.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Start Hiring
                        <span>→</span>
                    </button>

                </div>

                <div className="recruiter-decoration">

                    <div className="decoration-circle circle-one"></div>
                    <div className="decoration-circle circle-two"></div>
                    <div className="decoration-square"></div>

                </div>

            </section>


            {/* ================= FINAL CTA ================= */}

            <section className="final-cta">

                <div>

                    <span>
                        YOUR NEXT STEP
                    </span>

                    <h2>
                        Ready to find your next opportunity?
                    </h2>

                    <p>
                        Explore real opportunities and start
                        building your career with IntelliRecruit.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/candidate/jobs")
                        }
                    >
                        Explore Jobs
                        <span>→</span>
                    </button>

                </div>

            </section>


            {/* ================= FOOTER ================= */}

            <footer className="home-footer">

                <div className="footer-main">

                    <div className="footer-brand">

                        <div className="home-logo footer-logo">

                            <div className="logo-icon">
                                IR
                            </div>

                            <span>
                                Intelli<span>Recruit</span>
                            </span>

                        </div>

                        <p>
                            Connecting talent with opportunities
                            through smarter recruitment.
                        </p>

                    </div>

                    <div className="footer-column">

                        <h4>
                            Platform
                        </h4>

                        <button
                            onClick={() =>
                                navigate("/candidate/jobs")
                            }
                        >
                            Find Jobs
                        </button>

                        <button
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Create Account
                        </button>

                    </div>

                    <div className="footer-column">

                        <h4>
                            For Recruiters
                        </h4>

                        <button
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Start Hiring
                        </button>

                        <button
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Recruiter Login
                        </button>

                    </div>

                    <div className="footer-column">

                        <h4>
                            Account
                        </h4>

                        <button
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Login
                        </button>

                        <button
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Register
                        </button>

                    </div>

                </div>

                <div className="footer-bottom">

                    <span>
                        © 2026 IntelliRecruit. All rights reserved.
                    </span>

                    <span>
                        Intelligent Recruitment Platform
                    </span>

                </div>

            </footer>

        </div>
    );
}

export default Home;