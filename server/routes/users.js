const express = require("express");
const router = express.Router();
const {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  resetPassword,
  updateUser,
} = require("../controllers/usersController");
const { protect, hasPermission } = require("../middlewares/auth");

router.use(protect);
router.get("/", hasPermission("team.view"), listUsers);
router.post("/", hasPermission("team.create"), createUser);
router.get("/:id", hasPermission("team.view"), getUser);
router.patch("/:id", hasPermission("team.edit", "team.disable"), updateUser);
router.patch("/:id/password", hasPermission("team.edit"), resetPassword);
router.delete("/:id", hasPermission("team.delete"), deleteUser);

module.exports = router;
