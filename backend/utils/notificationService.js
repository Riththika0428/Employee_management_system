const Notification = require("../models/Notification");

const createNotification = async ({
  recipient,
  title,
  message,
  type,
}) => {
  try {
    await Notification.create({
      recipient,
      title,
      message,
      type,
    });
  } catch (error) {
    console.log(
      "Notification Error:",
      error.message
    );
  }
};

module.exports = createNotification;