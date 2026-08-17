const express = require("express");
const router = express.Router();
const { createUser, deleteUser, getUser, listUsers, resetPassword, updateUser } = require("../controllers/usersController");
const { protect } = require("../middlewares/auth");

router.use(protect);
router.get("/", listUsers);
router.post("/", createUser);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.patch("/:id/password", resetPassword);
router.delete("/:id", deleteUser);

module.exports = router;
