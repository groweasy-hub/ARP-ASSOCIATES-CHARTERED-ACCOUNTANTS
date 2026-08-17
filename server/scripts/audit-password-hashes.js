require("dotenv").config();

const connectDB = require("../config/db");
const Admin = require("../models/Admin");

const isStrongBcryptHash = (value = "") => /^\$2[aby]\$(1[2-9]|[2-9]\d)\$/.test(String(value));
const isMd5Hash = (value = "") => /^[a-f0-9]{32}$/i.test(String(value));
const isSha1Hash = (value = "") => /^[a-f0-9]{40}$/i.test(String(value));

const classifyPasswordStorage = (value = "") => {
  if (isStrongBcryptHash(value)) return "bcrypt-12-or-better";
  if (isMd5Hash(value)) return "md5";
  if (isSha1Hash(value)) return "sha1";
  return "plain-or-unsupported";
};

(async () => {
  await connectDB();
  const users = await Admin.find({}, "email employeeId password").lean();
  const weakAccounts = users
    .map((user) => ({
      id: String(user._id),
      email: user.email,
      employeeId: user.employeeId,
      storage: classifyPasswordStorage(user.password),
    }))
    .filter((user) => user.storage !== "bcrypt-12-or-better");

  console.log(
    JSON.stringify(
      {
        scanned: users.length,
        weakPasswordStorageCount: weakAccounts.length,
        weakAccounts,
        migration: "Weak/plain passwords are rehashed automatically after the next successful login.",
      },
      null,
      2,
    ),
  );
  process.exit(0);
})().catch((error) => {
  console.error("[password-hash-audit-failed]", { message: error.message });
  process.exit(1);
});
