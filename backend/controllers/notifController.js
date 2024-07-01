import Notification from "../models/notifModel.js"

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id

        const notifications = await Notification.find({ to: userId }).populate({
            path: "from",
            select: "username profileImg"
        })

        await Notification.updateMany({ to: userId }, { read: true })

        res.status(200).json(notifications)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id

        await Notification.deleteMany({ to: userId })

        res.status(200).json({ message: "notifications deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id
        const userId = req.user._id

        const notif = await Notification.findById(notificationId)
        if (!notif) {
            return res.status(404).json({ error: "notification not found" })
        }

        if (notif.to.toString() !== userId.toString()) {
            return res.status(403).json({ message: "you are not authorized to delete this notification" })
        }

        await Notification.findByIdAndDelete(notificationId)
        res.status(200).json({ message: "notification deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}