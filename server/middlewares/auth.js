const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin account not found" });
    }
    req.admin = admin;
    next();
  } catch (err) {
    next(err.name === "JsonWebTokenError" || err.name === "TokenExpiredError"
      ? Object.assign(new Error("Token invalid or expired"), { statusCode: 401 })
      : err);
  }
};

module.exports = { protect };
