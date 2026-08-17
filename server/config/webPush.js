const webPush = require("web-push");

const publicKey = process.env.VAPID_PUBLIC_KEY || "";
const privateKey = process.env.VAPID_PRIVATE_KEY || "";
const subject = process.env.VAPID_SUBJECT || "mailto:admin@arpassociates.in";

const isWebPushConfigured = Boolean(publicKey && privateKey);

if (isWebPushConfigured) {
  webPush.setVapidDetails(subject, publicKey, privateKey);
}

module.exports = {
  webPush,
  isWebPushConfigured,
  vapidPublicKey: publicKey,
};
