import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Login successful!");

      if (user.role === "candidate") {
        navigate("/candidate/dashboard");
      } else if (user.role === "recruiter") {
        navigate("/recruiter/dashboard");
      }

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Left Section */}
      <div className="auth-left">

        <div className="brand">
          <div className="brand-icon">✦</div>
          <span>HireFlow</span>
        </div>

        <div className="hero-content">
          <p className="eyebrow">INTELLIGENT RECRUITMENT</p>

          <h1>
            Find opportunities.
            <br />
            Build your future.
          </h1>

          <p className="hero-text">
            Connect with meaningful career opportunities,
            discover jobs that match your skills, and take
            the next step in your professional journey.
          </p>
        </div>

        <div className="hero-bottom">
          <span>✓ Smart job matching</span>
          <span>✓ Real opportunities</span>
        </div>

      </div>

      {/* Right Section */}
      <div className="auth-right">

        <div className="login-card">

          <div className="mobile-brand">
            <div className="brand-icon">✦</div>
            <span>HireFlow</span>
          </div>

          <div className="login-heading">
            <p className="small-heading">WELCOME BACK</p>
            <h2>Sign in to your account</h2>
            <p>
              Enter your details to continue to your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Email address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <span>→</span>}
            </button>

          </form>

          {message && (
            <div
              className={
                message === "Login successful!"
                  ? "success-message"
                  : "error-message"
              }
            >
              {message}
            </div>
          )}

          <div className="register-section">
            <span>Don't have an account?</span>

            <button
              onClick={() => navigate("/register")}
              className="register-link"
            >
              Create an account
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;