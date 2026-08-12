const express = require("express");
const router = express.Router();
const { createRole, deleteRole, listRoles, updateRole } = require("../controllers/rolesController");
const { protect, hasPermission } = require("../middlewares/auth");

router.use(protect);
router.get("/", hasPermission("roles.view", "team.create", "team.edit"), listRoles);
router.post("/", hasPermission("roles.create"), createRole);
router.patch("/:id", hasPermission("roles.edit"), updateRole);
router.delete("/:id", hasPermission("roles.delete"), deleteRole);

module.exports = router;
