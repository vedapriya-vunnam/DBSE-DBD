const db = require("../config/db");

// GET MY NOTIFICATIONS
const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [notifications] = await db.promise().query(
            `SELECT notification_id, title, message, type, is_read, created_at
             FROM notifications
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );

        res.status(200).json({
            message: "Notifications retrieved successfully",
            count: notifications.length,
            notifications
        });

    } catch (error) {
        console.error("Get notifications error:", error);

        res.status(500).json({
            message: "Failed to retrieve notifications",
            error: error.message
        });
    }
};


// GET UNREAD NOTIFICATION COUNT
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [result] = await db.promise().query(
            `SELECT COUNT(*) AS unread_count
             FROM notifications
             WHERE user_id = ? AND is_read = FALSE`,
            [userId]
        );

        res.status(200).json({
            unread_count: result[0].unread_count
        });

    } catch (error) {
        console.error("Unread count error:", error);

        res.status(500).json({
            message: "Failed to get unread count",
            error: error.message
        });
    }
};


// MARK ONE NOTIFICATION AS READ
const markAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const [result] = await db.promise().query(
            `UPDATE notifications
             SET is_read = TRUE
             WHERE notification_id = ? AND user_id = ?`,
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json({
            message: "Notification marked as read"
        });

    } catch (error) {
        console.error("Mark notification error:", error);

        res.status(500).json({
            message: "Failed to mark notification as read",
            error: error.message
        });
    }
};


// MARK ALL NOTIFICATIONS AS READ
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.userId;

        await db.promise().query(
            `UPDATE notifications
             SET is_read = TRUE
             WHERE user_id = ?`,
            [userId]
        );

        res.status(200).json({
            message: "All notifications marked as read"
        });

    } catch (error) {
        console.error("Mark all notifications error:", error);

        res.status(500).json({
            message: "Failed to mark all notifications as read",
            error: error.message
        });
    }
};


module.exports = {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
};