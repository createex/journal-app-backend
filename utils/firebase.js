const admin = require('firebase-admin');
const serviceAccount = require('../configs/serviceaccount');
const cron = require('node-cron');
const { userCluster } = require("../models");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function sendNotification(title, body, fcmToken) {
  try {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: fcmToken,
    };

    console.log('Sending message:', message);
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

async function sendDailyNotifications() {
  console.log('Starting daily notifications...'); // Add logging here
  try {
    // Fetch all users
    const users = await userCluster.find({ fcmToken: { $ne: null } });

    if (users.length === 0) {
      console.log('No users found or no FCM tokens available.');
      return;
    }

    // Send notification to each user
    for (let user of users) {
      await sendNotification(
        'Daily Post Reminder', // Title of the notification
        'Don\'t forget to make your daily post today!', // Body of the notification
        user.fcmToken
      );
      console.log('Notification sent to:', user.email); // Add logging for each user
    }
    console.log('All notifications sent.');
  } catch (error) {
    console.error('Error fetching users or sending notifications:', error);
  }
}

// Schedule the cron job to run every day at 10 AM
cron.schedule('0 10 * * *', () => {
  console.log('Running daily notification task');
  sendDailyNotifications();
});

console.log('Cron job script loaded'); // Log to confirm script execution

module.exports = admin;
