import { NavLink, useNavigate } from "react-router-dom";
import "./CandidateSidebar.css";

function CandidateSidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="candidate-sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">✦</div>
        <span>HireFlow</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <p className="sidebar-section-title">MAIN</p>

        <NavLink
          to="/candidate/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">⌂</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/candidate/jobs"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">⌕</span>
          <span>Find Jobs</span>
        </NavLink>

        <NavLink
          to="/candidate/applications"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">▤</span>
          <span>My Applications</span>
        </NavLink>

        <NavLink
          to="/candidate/saved-jobs"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">♡</span>
          <span>Saved Jobs</span>
        </NavLink>

        <NavLink
          to="/candidate/matching"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">✦</span>
          <span>Job Matching</span>
        </NavLink>

        <p className="sidebar-section-title second-section">ACTIVITY</p>

        <NavLink
          to="/candidate/interviews"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">◷</span>
          <span>Interviews</span>
        </NavLink>

        <NavLink
          to="/candidate/notifications"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">♢</span>
          <span>Notifications</span>
        </NavLink>

        <NavLink
          to="/candidate/profile"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <span className="sidebar-icon">◎</span>
          <span>Profile</span>
        </NavLink>

      </nav>

      {/* Bottom User Area */}
      <div className="sidebar-bottom">

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user.full_name
              ? user.full_name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="sidebar-user-info">
            <strong>
              {user.full_name || "User"}
            </strong>
            <span>Candidate</span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </div>

    </aside>
  );
}

export default CandidateSidebar;