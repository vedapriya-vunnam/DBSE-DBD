import { useEffect, useState } from "react";
import axios from "axios";
import CandidateSidebar from "../../components/CandidateSidebar";
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
        setError("Please login again to view your notifications.");
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
        "CANDIDATE NOTIFICATIONS RESPONSE:",
        response.data
      );

      setNotifications(
        response.data.notifications ||
        response.data.data ||
        []
      );

    } catch (error) {
      console.error(
        "NOTIFICATIONS ERROR:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        "Failed to load notifications"
      );

    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notification_id === notificationId
            ? { ...notification, is_read: 1 }
            : notification
        )
      );

    } catch (error) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        error.response?.data || error.message
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

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: 1
        }))
      );

    } catch (error) {
      console.error(
        "MARK ALL READ ERROR:",
        error.response?.data || error.message
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatNotificationType = (type) => {
    if (!type) return "Notification";

    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const unreadCount = notifications.filter(
    (notification) =>
      notification.is_read === 0 ||
      notification.is_read === false
  ).length;

  return (
    <div className="candidate-layout">

      <CandidateSidebar />

      <main className="candidate-main">

        <div className="notifications-page">

          {/* Header */}
          <div className="notifications-header">

            <div>
              <p className="dashboard-label">
                NOTIFICATIONS
              </p>

              <h1>
                Stay updated
              </h1>

              <p>
                Keep track of application updates,
                interviews, and important activity.
              </p>
            </div>

            <div className="notifications-header-actions">

              <div className="notifications-count">

                <span>
                  {unreadCount}
                </span>

                <small>
                  Unread
                </small>

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

          </div>


          {/* Loading */}
          {loading && (
            <div className="notifications-message">
              Loading your notifications...
            </div>
          )}


          {/* Error */}
          {!loading && error && (
            <div className="notifications-message error">
              {error}
            </div>
          )}


          {/* Empty */}
          {!loading &&
            !error &&
            notifications.length === 0 && (

              <div className="notifications-empty">

                <div className="notifications-empty-icon">
                  ✓
                </div>

                <h2>
                  You're all caught up
                </h2>

                <p>
                  You don't have any notifications right now.
                  We'll let you know when something important
                  happens.
                </p>

              </div>
            )
          }


          {/* Notifications */}
          {!loading &&
            !error &&
            notifications.length > 0 && (

              <div className="notifications-list">

                {notifications.map((notification) => {

                  const isUnread =
                    notification.is_read === 0 ||
                    notification.is_read === false;

                  return (
                    <div
                      key={notification.notification_id}
                      className={`notification-card ${
                        isUnread ? "unread" : "read"
                      }`}
                    >

                      <div className="notification-icon">
                        {isUnread ? "●" : "✓"}
                      </div>


                      <div className="notification-content">

                        <div className="notification-top">

                          <div>
                            <span className="notification-type">
                              {formatNotificationType(
                                notification.type
                              )}
                            </span>

                            <h2>
                              {notification.title ||
                                "Notification"}
                            </h2>
                          </div>

                          {isUnread && (
                            <span className="unread-badge">
                              New
                            </span>
                          )}

                        </div>


                        <p className="notification-message-text">
                          {notification.message ||
                            notification.description ||
                            "You have a new notification."}
                        </p>


                        <div className="notification-footer">

                          <span className="notification-time">
                            {formatDate(
                              notification.created_at
                            )}

                            {notification.created_at && (
                              <>
                                {" • "}
                                {formatTime(
                                  notification.created_at
                                )}
                              </>
                            )}
                          </span>


                          {isUnread && (
                            <button
                              className="mark-read-button"
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
            )
          }

        </div>

      </main>

    </div>
  );
}

export default Notifications;