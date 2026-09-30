import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "candidate"
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
      await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      setMessage("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed"
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
          <p className="eyebrow">START YOUR JOURNEY</p>

          <h1>
            Your next
            <br />
            opportunity starts here.
          </h1>

          <p className="hero-text">
            Create your account and discover opportunities,
            connect with recruiters, and move closer to your
            career goals.
          </p>
        </div>

        <div className="hero-bottom">
          <span>✓ Smart job matching</span>
          <span>✓ Career opportunities</span>
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
            <p className="small-heading">GET STARTED</p>

            <h2>Create your account</h2>

            <p>
              Join the platform and start your recruitment journey.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="input-group">
              <label>Full name</label>

              <input
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
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

            {/* Phone */}
            <div className="input-group">
              <label>Phone number</label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role */}
            <div className="input-group">
              <label>Account type</label>

              <div className="role-selection">

                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="candidate"
                    checked={formData.role === "candidate"}
                    onChange={handleChange}
                  />

                  <div>
                    <strong>Candidate</strong>
                    <span>Looking for opportunities</span>
                  </div>
                </label>

                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={formData.role === "recruiter"}
                    onChange={handleChange}
                  />

                  <div>
                    <strong>Recruiter</strong>
                    <span>Hiring talented people</span>
                  </div>
                </label>

              </div>
            </div>

            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <span>→</span>}
            </button>

          </form>

          {message && (
            <div
              className={
                message === "Account created successfully!"
                  ? "success-message"
                  : "error-message"
              }
            >
              {message}
            </div>
          )}

          <div className="register-section">
            <span>Already have an account?</span>

            <button
              onClick={() => navigate("/login")}
              className="register-link"
            >
              Sign in
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;