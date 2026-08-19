const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { z } = require("zod");

const LOGIN_FAILURE_MESSAGE = "Incorrect email or password";
const PASSWORD_RESET_RESPONSE = "If that email is registered, you'll receive a reset link";
const REGISTRATION_FAILURE_MESSAGE = "Registration request could not be completed";
const AUTH_VALIDATION_FAILURE_MESSAGE = "Invalid request";
const PASSWORD_UPDATE_FAILURE_MESSAGE = "Password update could not be completed";
const PROFILE_UPDATE_FAILURE_MESSAGE = "Profile update could not be completed";
const USER_LOOKUP_FAILURE_MESSAGE = "User request could not be completed";

const LOGIN_WINDOW_MS = 60 * 1000;
const LOGIN_RATE_LIMIT = 10;
const ACCOUNT_LOCK_MS = 15 * 60 * 1000;
const MAX_PROGRESSIVE_DELAY_MS = 10 * 1000;

const ipLoginAttempts = new Map();
const accountLoginAttempts = new Map();

const stripHtml = (value = "") =>
  String(value)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, "");

const sanitizeText = (value = "", pattern = /[^a-zA-Z0-9 ._@+\-'()/-]/g) =>
  stripHtml(value).replace(pattern, "").trim();

const sanitizeEmail = (value = "") =>
  stripHtml(value).replace(/[^a-zA-Z0-9@._+-]/g, "").trim().toLowerCase();

const sanitizeUsername = (value = "") =>
  stripHtml(value).replace(/[^a-zA-Z0-9@._+-]/g, "").trim();

const sanitizePassword = (value = "") => stripHtml(value).slice(0, 128);

const passwordSchema = z
  .string()
  .transform(sanitizePassword)
  .pipe(z.string().min(8).max(128));

const emailSchema = z
  .string()
  .transform(sanitizeEmail)
  .pipe(z.string().email().min(5).max(254));

const identifierSchema = z
  .string()
  .transform(sanitizeUsername)
  .pipe(z.string().min(3).max(254).regex(/^[a-zA-Z0-9@._+-]+$/));

const displayNameSchema = z
  .string()
  .optional()
  .transform((value) => sanitizeText(value || ""))
  .pipe(z.string().max(80));

const optionalShortTextSchema = z
  .string()
  .optional()
  .transform((value) => sanitizeText(value || ""))
  .pipe(z.string().max(120));

const loginSchema = z.object({
  email: identifierSchema,
  password: passwordSchema,
});

const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: displayNameSchema,
  lastName: displayNameSchema,
  employeeId: z
    .string()
    .optional()
    .transform((value) => sanitizeUsername(value || "").toUpperCase())
    .pipe(z.string().max(32)),
  phone: optionalShortTextSchema,
  designation: optionalShortTextSchema,
  department: optionalShortTextSchema,
  address: z
    .string()
    .optional()
    .transform((value) => sanitizeText(value || "", /[^a-zA-Z0-9 .,#_@+\-'()/-]/g))
    .pipe(z.string().max(240)),
  teamMate: optionalShortTextSchema,
  role: optionalShortTextSchema,
  status: optionalShortTextSchema,
  dateOfJoining: z.string().optional().or(z.date()).or(z.literal("")),
  profileImage: z.string().optional(),
});

const userUpdateSchema = signupSchema
  .omit({ password: true })
  .partial()
  .extend({
    profileImage: z.string().optional(),
  });

const passwordChangeSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
});

const adminResetPasswordSchema = z.object({
  password: passwordSchema,
});

const passwordResetSchema = z.object({
  email: emailSchema,
  newEmail: z
    .string()
    .optional()
    .transform((value) => (value ? sanitizeEmail(value) : ""))
    .pipe(z.string().max(254)),
  otp: z
    .string()
    .transform((value) => sanitizeText(value, /[^0-9]/g))
    .pipe(z.string().length(6)),
  password: passwordSchema,
  confirmPassword: passwordSchema,
});

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

const profileUpdateSchema = z.object({
  otp: z
    .string()
    .transform((value) => sanitizeText(value, /[^0-9]/g))
    .pipe(z.string().length(6)),
  email: z
    .string()
    .optional()
    .transform((value) => (value ? sanitizeEmail(value) : ""))
    .pipe(z.string().max(254)),
  phone: optionalShortTextSchema,
  profileImage: z.string().optional(),
  password: z.string().optional().transform((value) => (value ? sanitizePassword(value) : "")),
  confirmPassword: z.string().optional().transform((value) => (value ? sanitizePassword(value) : "")),
});

const logValidationFailure = (context, error, req) => {
  console.warn("[auth-validation-failed]", {
    context,
    ip: req?.ip,
    path: req?.originalUrl,
    issues: error?.issues?.map((issue) => ({
      path: issue.path.join("."),
      code: issue.code,
    })),
  });
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const validateAuthBody = (schema, body, context, req) => {
  const result = schema.safeParse(body || {});
  if (!result.success) {
    logValidationFailure(context, result.error, req);
    return { ok: false, data: null };
  }
  return { ok: true, data: result.data };
};

const pruneExpiredIpAttempts = (now) => {
  for (const [ip, entry] of ipLoginAttempts.entries()) {
    if (entry.resetAt <= now) ipLoginAttempts.delete(ip);
  }
};

const loginRateLimiter = (req, res, next) => {
  const now = Date.now();
  pruneExpiredIpAttempts(now);
  const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const entry = ipLoginAttempts.get(key) || { count: 0, resetAt: now + LOGIN_WINDOW_MS };
  if (entry.resetAt <= now) {
    entry.count = 0;
    entry.resetAt = now + LOGIN_WINDOW_MS;
  }
  entry.count += 1;
  ipLoginAttempts.set(key, entry);

  if (entry.count > LOGIN_RATE_LIMIT) {
    return res.status(429).json({ success: false, message: LOGIN_FAILURE_MESSAGE });
  }
  next();
};

const getLoginState = (identifier = "") => {
  const key = sanitizeUsername(identifier).toLowerCase();
  const now = Date.now();
  const entry = accountLoginAttempts.get(key);
  if (!entry) return { key, blocked: false, delayMs: 0 };
  if (entry.lockedUntil && entry.lockedUntil > now) {
    return { key, blocked: true, delayMs: entry.lockedUntil - now };
  }
  if (entry.delayUntil && entry.delayUntil > now) {
    return { key, blocked: true, delayMs: entry.delayUntil - now };
  }
  if (entry.lockedUntil && entry.lockedUntil <= now) {
    entry.lockedUntil = 0;
    accountLoginAttempts.set(key, entry);
  }
  return { key, blocked: false, delayMs: 0 };
};

const registerLoginFailure = (identifier = "") => {
  const key = sanitizeUsername(identifier).toLowerCase();
  const now = Date.now();
  const entry = accountLoginAttempts.get(key) || { count: 0, lockedUntil: 0, delayUntil: 0 };
  entry.count += 1;
  const progressiveDelay = Math.min(entry.count * 1000, MAX_PROGRESSIVE_DELAY_MS);
  entry.delayUntil = now + progressiveDelay;
  const locked = entry.count >= 5;
  if (locked) entry.lockedUntil = now + ACCOUNT_LOCK_MS;
  accountLoginAttempts.set(key, entry);
  return { count: entry.count, locked, delayMs: progressiveDelay };
};

const clearLoginFailures = (identifier = "") => {
  const key = sanitizeUsername(identifier).toLowerCase();
  accountLoginAttempts.delete(key);
};

const isBcryptHash = (value = "") => /^\$2[aby]\$(1[2-9]|[2-9]\d)\$/.test(String(value));
const isMd5Hash = (value = "") => /^[a-f0-9]{32}$/i.test(String(value));
const isSha1Hash = (value = "") => /^[a-f0-9]{40}$/i.test(String(value));

const constantTimeEqual = (left = "", right = "") => {
  const leftDigest = crypto.createHash("sha256").update(String(left)).digest();
  const rightDigest = crypto.createHash("sha256").update(String(right)).digest();
  return crypto.timingSafeEqual(leftDigest, rightDigest);
};

const verifyAndMigratePassword = async (admin, candidatePassword) => {
  const storedPassword = String(admin.password || "");
  const candidate = String(candidatePassword || "");
  if (isBcryptHash(storedPassword)) {
    return bcrypt.compare(candidate, storedPassword);
  }

  let matches = false;
  if (isMd5Hash(storedPassword)) {
    matches = constantTimeEqual(crypto.createHash("md5").update(candidate).digest("hex"), storedPassword.toLowerCase());
  } else if (isSha1Hash(storedPassword)) {
    matches = constantTimeEqual(crypto.createHash("sha1").update(candidate).digest("hex"), storedPassword.toLowerCase());
  } else {
    matches = constantTimeEqual(candidate, storedPassword);
  }

  if (matches) {
    admin.password = candidate;
    await admin.save();
  }
  return matches;
};

module.exports = {
  AUTH_VALIDATION_FAILURE_MESSAGE,
  LOGIN_FAILURE_MESSAGE,
  PASSWORD_RESET_RESPONSE,
  PASSWORD_UPDATE_FAILURE_MESSAGE,
  PROFILE_UPDATE_FAILURE_MESSAGE,
  REGISTRATION_FAILURE_MESSAGE,
  adminResetPasswordSchema,
  clearLoginFailures,
  constantTimeEqual,
  forgotPasswordSchema,
  getLoginState,
  loginRateLimiter,
  loginSchema,
  passwordChangeSchema,
  passwordResetSchema,
  profileUpdateSchema,
  registerLoginFailure,
  signupSchema,
  userUpdateSchema,
  wait,
  validateAuthBody,
  verifyAndMigratePassword,
  USER_LOOKUP_FAILURE_MESSAGE,
};
