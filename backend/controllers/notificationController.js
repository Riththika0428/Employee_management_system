const Notification = require("../models/Notification");



// ==========================================
// Get Notifications
// ==========================================
const getNotifications = async (req, res) => {
  try {
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const notifications =
      await Notification.find({
        recipient: req.user._id,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total =
      await Notification.countDocuments({
        recipient: req.user._id,
      });

    const unreadCount =
      await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
      });

    res.status(200).json({
      total,
      unreadCount,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Mark Single as Read
// ==========================================
const markAsRead = async (req, res) => {
  try {
    const notification =
      await Notification.findById(
        req.params.id
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    if (
      notification.recipient.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      message:
        "Notification marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Mark All as Read
// ==========================================
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user._id,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      message:
        "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ==========================================
// Delete Notification
// ==========================================
const deleteNotification = async (
  req,
  res
) => {
  try {
    const notification =
      await Notification.findById(
        req.params.id
      );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    if (
      notification.recipient.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      message: "Notification deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};