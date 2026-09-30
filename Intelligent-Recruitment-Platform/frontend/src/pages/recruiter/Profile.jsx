import { useEffect, useState } from "react";
import axios from "axios";
import RecruiterSidebar from "../../components/RecruiterSidebar";
import "./Profile.css";

function Profile() {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        company_name: "",
        company_description: "",
        company_website: "",
        company_location: ""
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
                setError("Please login again.");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/api/recruiter/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("RECRUITER PROFILE:", response.data);

            const profile =
                response.data.profile ||
                response.data;

            setFormData({
                full_name: profile.full_name || "",
                email: profile.email || "",
                phone: profile.phone || "",
                company_name: profile.company_name || "",
                company_description:
                    profile.company_description || "",
                company_website:
                    profile.company_website || "",
                company_location:
                    profile.company_location || ""
            });

        } catch (err) {
            console.error(
                "PROFILE ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Failed to load profile"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await axios.put(
                "http://localhost:5000/api/recruiter/profile",
                {
                    full_name: formData.full_name,
                    phone: formData.phone,
                    company_name: formData.company_name,
                    company_description:
                        formData.company_description,
                    company_website:
                        formData.company_website,
                    company_location:
                        formData.company_location
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "PROFILE UPDATE:",
                response.data
            );

            setMessage("Profile updated successfully!");

            await fetchProfile();

        } catch (err) {
            console.error(
                "PROFILE UPDATE ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Failed to update profile"
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
                    <div className="profile-message">
                        Loading profile...
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="recruiter-layout">

            <RecruiterSidebar />

            <main className="recruiter-main">

                <div className="recruiter-profile-page">

                    <div className="profile-header">

                        <div>
                            <p className="page-label">
                                ACCOUNT
                            </p>

                            <h1>
                                Recruiter Profile
                            </h1>

                            <p>
                                Manage your recruiter and company information.
                            </p>
                        </div>

                        <div className="profile-avatar">
                            {formData.full_name
                                ? formData.full_name
                                      .charAt(0)
                                      .toUpperCase()
                                : "R"}
                        </div>

                    </div>

                    {message && (
                        <div className="profile-success">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="profile-error">
                            {error}
                        </div>
                    )}

                    <form
                        className="profile-form"
                        onSubmit={handleSubmit}
                    >

                        <section className="profile-section">

                            <div className="section-heading">
                                <h2>
                                    Personal Information
                                </h2>

                                <p>
                                    Your recruiter account information.
                                </p>
                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                    />

                                    <small>
                                        Email cannot be changed here.
                                    </small>

                                </div>

                            </div>

                            <div className="form-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                />

                            </div>

                        </section>

                        <section className="profile-section">

                            <div className="section-heading">
                                <h2>
                                    Company Information
                                </h2>

                                <p>
                                    Information candidates will see about your company.
                                </p>
                            </div>

                            <div className="form-group">

                                <label>
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    name="company_name"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Company Description
                                </label>

                                <textarea
                                    name="company_description"
                                    value={
                                        formData.company_description
                                    }
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="Tell candidates about your company..."
                                />

                            </div>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Company Website
                                    </label>

                                    <input
                                        type="url"
                                        name="company_website"
                                        value={
                                            formData.company_website
                                        }
                                        onChange={handleChange}
                                        placeholder="https://example.com"
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Company Location
                                    </label>

                                    <input
                                        type="text"
                                        name="company_location"
                                        value={
                                            formData.company_location
                                        }
                                        onChange={handleChange}
                                        placeholder="Hyderabad"
                                    />

                                </div>

                            </div>

                        </section>

                        <div className="profile-actions">

                            <button
                                type="submit"
                                className="save-profile-button"
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