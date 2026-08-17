const cloudinary = require("cloudinary").v2;

const requiredCloudinarySettings = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const getMissingCloudinarySettings = () =>
  requiredCloudinarySettings.filter((key) => !String(process.env[key] || "").trim());

const assertCloudinaryConfigured = () => {
  const missing = getMissingCloudinarySettings();
  if (missing.length) {
    const error = new Error(`Cloudinary is not configured yet. Missing settings: ${missing.join(", ")}`);
    error.statusCode = 503;
    throw error;
  }
};

const configureCloudinary = () => {
  assertCloudinaryConfigured();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const isDataImage = (value = "") => /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(String(value));
const isRemoteImage = (value = "") => /^https?:\/\//.test(String(value));

const uploadProfileImage = async (image) => {
  if (!image || (!isDataImage(image) && !isRemoteImage(image))) return null;
  configureCloudinary();
  return cloudinary.uploader.upload(image, {
    folder: process.env.CLOUDINARY_PROFILE_FOLDER || "arp-associates/employees",
    resource_type: "image",
    overwrite: false,
  });
};

const deleteProfileImage = async (publicId) => {
  if (!publicId) return;
  configureCloudinary();
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};

module.exports = {
  deleteProfileImage,
  getMissingCloudinarySettings,
  isDataImage,
  isRemoteImage,
  uploadProfileImage,
};
