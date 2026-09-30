import { useEffect, useState } from "react";
import axios from "axios";
import RecruiterSidebar from "../../components/RecruiterSidebar";
import "./Notifications.css";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Please login again.");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                "http://localhost:5000/api/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "RECRUITER NOTIFICATIONS:",
                response.data
            );

            setNotifications(
                response.data.notifications ||
                response.data.data ||
                []
            );

        } catch (err) {
            console.error(
                "NOTIFICATIONS ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Failed to load notifications"
            );
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:5000/api/notifications/${id}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchNotifications();

        } catch (err) {
            console.error(
                "MARK READ ERROR:",
                err.response?.data || err.message
            );
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(
                "http://localhost:5000/api/notifications/read-all",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchNotifications();

        } catch (err) {
            console.error(
                "MARK ALL READ ERROR:",
                err.response?.data || err.message
            );
        }
    };

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getIcon = (type) => {
        switch (type) {
            case "application":
                return "◉";

            case "interview":
                return "◷";

            case "job":
                return "▣";

            default:
                return "◆";
        }
    };

    const unreadCount = notifications.filter(
        (notification) => Number(notification.is_read) === 0
    ).length;

    return (
        <div className="recruiter-layout">

            <RecruiterSidebar />

            <main className="recruiter-main">

                <div className="recruiter-notifications-page">

                    <div className="notifications-header">

                        <div>
                            <p className="page-label">
                                NOTIFICATIONS
                            </p>

                            <h1>
                                Notifications
                            </h1>

                            <p>
                                Stay updated with your recruitment activity.
                            </p>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                className="mark-all-button"
                                onClick={markAllAsRead}
                            >
                                Mark all as read
                            </button>
                        )}

                    </div>

                    <div className="notification-summary">
                        <strong>{unreadCount}</strong>
                        <span>
                            {unreadCount === 1
                                ? "Unread notification"
                                : "Unread notifications"}
                        </span>
                    </div>

                    {loading && (
                        <div className="notifications-message">
                            Loading notifications...
                        </div>
                    )}

                    {error && (
                        <div className="notifications-message error">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        notifications.length === 0 && (

                            <div className="notifications-empty">

                                <div className="empty-notification-icon">
                                    ♢
                                </div>

                                <h2>
                                    No notifications yet
                                </h2>

                                <p>
                                    New applications and recruitment
                                    updates will appear here.
                                </p>

                            </div>
                        )}

                    {!loading &&
                        !error &&
                        notifications.length > 0 && (

                            <div className="notifications-list">

                                {notifications.map((notification) => {

                                    const unread =
                                        Number(notification.is_read) === 0;

                                    return (
                                        <div
                                            key={notification.notification_id}
                                            className={`notification-card ${
                                                unread ? "unread" : ""
                                            }`}
                                        >

                                            <div
                                                className={`notification-icon ${notification.type || "system"}`}
                                            >
                                                {getIcon(
                                                    notification.type
                                                )}
                                            </div>

                                            <div className="notification-content">

                                                <div className="notification-title-row">

                                                    <h2>
                                                        {notification.title}
                                                    </h2>

                                                    {unread && (
                                                        <span className="unread-dot">
                                                        </span>
                                                    )}

                                                </div>

                                                <p className="notification-message">
                                                    {notification.message}
                                                </p>

                                                <div className="notification-bottom">

                                                    <span className="notification-date">
                                                        {formatDate(
                                                            notification.created_at
                                                        )}
                                                    </span>

                                                    {unread && (
                                                        <button
                                                            className="read-button"
                                                            onClick={() =>
                                                                markAsRead(
                                                                    notification.notification_id
                                                                )
                                                            }
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}

                                                </div>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                </div>

            </main>

        </div>
    );
}

export default Notifications;