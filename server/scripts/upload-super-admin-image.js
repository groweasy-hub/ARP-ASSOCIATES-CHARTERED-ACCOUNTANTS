require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const dns = require("dns");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const { deleteProfileImage, isDataImage, isRemoteImage, uploadProfileImage } = require("../config/cloudinary");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const email = String(process.env.SUPER_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const admin = await Admin.findOne({
    $or: [{ email }, { role: "SUPER_ADMIN" }],
  });

  if (!admin) {
    throw new Error("Super Admin user was not found");
  }

  if (!admin.profileImage) {
    throw new Error(`Super Admin ${admin.email} does not have a profile image to upload`);
  }

  if (admin.profileImagePublicId && !isDataImage(admin.profileImage)) {
    console.log(
      JSON.stringify(
        {
          message: "Super Admin profile image already has a Cloudinary public ID, nothing to upload",
          email: admin.email,
          profileImage: admin.profileImage,
          profileImagePublicId: admin.profileImagePublicId || "",
        },
        null,
        2,
      ),
    );
    return;
  }

  if (!isDataImage(admin.profileImage) && !isRemoteImage(admin.profileImage)) {
    throw new Error("Super Admin profile image is not an uploadable image value");
  }

  const previousPublicId = admin.profileImagePublicId;
  const uploaded = await uploadProfileImage(admin.profileImage);
  admin.profileImage = uploaded.secure_url;
  admin.profileImagePublicId = uploaded.public_id;
  await admin.save();

  if (previousPublicId) {
    await deleteProfileImage(previousPublicId);
  }

  console.log(
    JSON.stringify(
      {
        message: "Super Admin profile image uploaded to Cloudinary and saved",
        email: admin.email,
        profileImage: admin.profileImage,
        profileImagePublicId: admin.profileImagePublicId,
      },
      null,
      2,
    ),
  );
};

run()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
  });
