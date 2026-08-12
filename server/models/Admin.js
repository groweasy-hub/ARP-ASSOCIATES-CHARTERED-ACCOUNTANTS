const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLE_NAMES } = require("../config/permissions");

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    employeeId: { type: String, trim: true, default: "" },
    department: { type: String, trim: true, default: "Administration" },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(ROLE_NAMES),
      default: ROLE_NAMES.TEAM_MEMBER,
    },
    customRole: { type: mongoose.Schema.Types.ObjectId, ref: "Role", default: null },
    permissions: [{ type: String }],
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended", "Pending"],
      default: "Active",
    },
    profileImage: { type: String, default: "" },
    lastLogin: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

adminSchema.set("toJSON", {
  transform(_, ret) {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    return ret;
  },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
