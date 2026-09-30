import { useEffect, useState } from "react";
import axios from "axios";
import CandidateSidebar from "../../components/CandidateSidebar";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    headline: "",
    bio: "",
    location: "",
    education: "",
    experience_years: 0,
    resume_url: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again to view your profile.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/candidate/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("CANDIDATE PROFILE RESPONSE:", response.data);

      const data =
        response.data.profile ||
        response.data.candidate ||
        response.data;

      setProfile({
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        headline: data.headline || "",
        bio: data.bio || "",
        location: data.location || "",
        education: data.education || "",
        experience_years: data.experience_years || 0,
        resume_url: data.resume_url || "",
        linkedin_url: data.linkedin_url || "",
        github_url: data.github_url || "",
        portfolio_url: data.portfolio_url || ""
      });

    } catch (error) {
      console.error(
        "PROFILE ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to load profile"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
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
        "http://localhost:5000/api/candidate/profile",
        {
          full_name: profile.full_name,
          phone: profile.phone,
          headline: profile.headline,
          bio: profile.bio,
          location: profile.location,
          education: profile.education,
          experience_years: Number(
            profile.experience_years || 0
          ),
          resume_url: profile.resume_url,
          linkedin_url: profile.linkedin_url,
          github_url: profile.github_url,
          portfolio_url: profile.portfolio_url
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        "PROFILE UPDATE RESPONSE:",
        response.data
      );

      setMessage(
        response.data.message ||
        "Profile updated successfully!"
      );

      await fetchProfile();

    } catch (error) {
      console.error(
        "PROFILE UPDATE ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to update profile"
      );

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="candidate-layout">

      <CandidateSidebar />

      <main className="candidate-main">

        <div className="profile-page">

          {/* Header */}
          <div className="profile-header">

            <div>
              <p className="dashboard-label">
                PROFILE
              </p>

              <h1>
                Your profile
              </h1>

              <p>
                Keep your professional information
                updated for better job matches.
              </p>
            </div>

          </div>


          {/* Error */}
          {error && (
            <div className="profile-message error">
              {error}
            </div>
          )}


          {/* Success */}
          {message && (
            <div className="profile-message success">
              {message}
            </div>
          )}


          <form
            className="profile-form"
            onSubmit={handleSubmit}
          >

            {/* Personal Information */}
            <section className="profile-section">

              <div className="profile-section-header">

                <div className="profile-section-icon">
                  ◎
                </div>

                <div>
                  <h2>
                    Personal Information
                  </h2>

                  <p>
                    Basic information about you.
                  </p>
                </div>

              </div>


              <div className="profile-grid">

                <div className="profile-field">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />

                </div>


                <div className="profile-field">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    value={profile.email}
                    disabled
                  />

                  <small>
                    Email cannot be changed here.
                  </small>

                </div>


                <div className="profile-field">

                  <label>
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />

                </div>


                <div className="profile-field">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="e.g. Hyderabad"
                  />

                </div>

              </div>

            </section>


            {/* Professional Information */}
            <section className="profile-section">

              <div className="profile-section-header">

                <div className="profile-section-icon">
                  ✦
                </div>

                <div>
                  <h2>
                    Professional Information
                  </h2>

                  <p>
                    Help recruiters understand your
                    professional background.
                  </p>
                </div>

              </div>


              <div className="profile-field">

                <label>
                  Professional Headline
                </label>

                <input
                  type="text"
                  name="headline"
                  value={profile.headline}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science Student"
                />

              </div>


              <div className="profile-field">

                <label>
                  About You
                </label>

                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell recruiters about yourself..."
                  rows="5"
                />

              </div>


              <div className="profile-grid">

                <div className="profile-field">

                  <label>
                    Education
                  </label>

                  <input
                    type="text"
                    name="education"
                    value={profile.education}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech Computer Science"
                  />

                </div>


                <div className="profile-field">

                  <label>
                    Experience (Years)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    name="experience_years"
                    value={profile.experience_years}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </section>


            {/* Professional Links */}
            <section className="profile-section">

              <div className="profile-section-header">

                <div className="profile-section-icon">
                  ↗
                </div>

                <div>
                  <h2>
                    Professional Links
                  </h2>

                  <p>
                    Add links to your professional
                    profiles and portfolio.
                  </p>
                </div>

              </div>


              <div className="profile-field">

                <label>
                  Resume URL
                </label>

                <input
                  type="url"
                  name="resume_url"
                  value={profile.resume_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />

              </div>


              <div className="profile-grid">

                <div className="profile-field">

                  <label>
                    LinkedIn
                  </label>

                  <input
                    type="url"
                    name="linkedin_url"
                    value={profile.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                  />

                </div>


                <div className="profile-field">

                  <label>
                    GitHub
                  </label>

                  <input
                    type="url"
                    name="github_url"
                    value={profile.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                  />

                </div>

              </div>


              <div className="profile-field">

                <label>
                  Portfolio
                </label>

                <input
                  type="url"
                  name="portfolio_url"
                  value={profile.portfolio_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />

              </div>

            </section>


            {/* Save */}
            <div className="profile-save-section">

              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Profile"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default Profile;