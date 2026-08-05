const express = require("express");
const router = express.Router();
const { login, updatePassword, verifyToken } = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

router.post("/login", login);
router.get("/verify", protect, verifyToken);
router.patch("/password", protect, updatePassword);

module.exports = router;
