import { NavLink, useNavigate } from "react-router-dom";
import "./RecruiterSidebar.css";

function RecruiterSidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="recruiter-sidebar">

      <div className="recruiter-sidebar-logo">
        <div className="recruiter-logo-icon">
          IR
        </div>

        <div>
          <h2>IntelliRecruit</h2>
          <span>Recruiter Portal</span>
        </div>
      </div>


      <nav className="recruiter-sidebar-nav">

        <p className="recruiter-nav-label">
          MAIN
        </p>

        <NavLink
          to="/recruiter/dashboard"
          className={({ isActive }) =>
            `recruiter-nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span>⌂</span>
          Dashboard
        </NavLink>


        <NavLink
          to="/recruiter/jobs"
          className={({ isActive }) =>
            `recruiter-nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span>▣</span>
          My Jobs
        </NavLink>


        <NavLink
          to="/recruiter/applications"
          className={({ isActive }) =>
            `recruiter-nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span>◉</span>
          Applications
        </NavLink>


        <NavLink
          to="/recruiter/interviews"
          className={({ isActive }) =>
            `recruiter-nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span>◷</span>
          Interviews
        </NavLink>


        <p className="recruiter-nav-label second">
          ACCOUNT
        </p>


        <NavLink
          to="/recruiter/notifications"
          className={({ isActive }) =>
            `recruiter-nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span>♢</span>
          Notifications
        </NavLink>


        <NavLink
          to="/recruiter/profile"
          className={({ isActive }) =>
            `recruiter-nav-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span>◎</span>
          Profile
        </NavLink>

      </nav>


      <div className="recruiter-sidebar-bottom">

        <div className="recruiter-user">

          <div className="recruiter-user-avatar">
            {user.full_name
              ? user.full_name
                  .charAt(0)
                  .toUpperCase()
              : "R"}
          </div>

          <div className="recruiter-user-info">

            <strong>
              {user.full_name || "Recruiter"}
            </strong>

            <span>
              Recruiter
            </span>

          </div>

        </div>


        <button
          className="recruiter-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </div>

    </aside>
  );
}

export default RecruiterSidebar;