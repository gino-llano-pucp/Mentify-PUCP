const notificationService = require('../services/NotificationServices');

exports.getUserNotifications = async (req, res) => {
    const userId = req.user.id;
    try {
        const notifications = await notificationService.fetchNotificationsForUser(userId);
        if (!notifications || notifications.length === 0) {
            return res.status(404).json({ message: "No se encontraron notificaciones." });
        }
        res.json({ data: notifications, message: "Notificaciones recuperadas con éxito." });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Error interno al recuperar las notificaciones.", details: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    const { notificationIds } = req.body;
    const performedBy = req.user.id;
    if (!Array.isArray(notificationIds)) {
        return res.status(400).json({ message: 'Invalid input. Expected an array of notification IDs.' });
    }

    try {
        await notificationService.markNotificationsAsRead(notificationIds, performedBy);
        res.status(200).json({ message: 'Notifications marked as read successfully.' });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        res.status(500).json({ message: "Error interno al marcar las notificaciones como leídas.", details: error.message });
    }
};
