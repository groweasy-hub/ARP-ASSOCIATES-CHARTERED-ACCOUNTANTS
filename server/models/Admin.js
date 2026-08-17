const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLE_NAMES } = require("../config/permissions");
const { verifyAndMigratePassword } = require("../utils/authSecurity");

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    employeeId: { type: String, trim: true, uppercase: true, default: "" },
    designation: { type: String, trim: true, default: "" },
    department: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    dateOfJoining: Date,
    teamMate: { type: String, trim: true, default: "" },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(ROLE_NAMES),
      default: ROLE_NAMES.EMPLOYEE,
    },
    customRole: { type: mongoose.Schema.Types.ObjectId, ref: "Role", default: null },
    mustChangePassword: { type: Boolean, default: false },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    otpHash: { type: String },
    otpPurpose: { type: String },
    otpExpires: { type: Date },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended", "Pending"],
      default: "Active",
    },
    profileImage: { type: String, default: "" },
    profileImagePublicId: { type: String, default: "" },
    lastLogin: Date,
  },
  { timestamps: true }
);

adminSchema.set("toJSON", {
  transform(_, ret) {
    delete ret.password;
    return ret;
  },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return verifyAndMigratePassword(this, candidatePassword);
};

module.exports = mongoose.model("Admin", adminSchema);
