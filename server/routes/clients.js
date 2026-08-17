const express = require("express");
const router = express.Router();
const {
  createClient,
  deleteClient,
  getClient,
  listClients,
  updateClient,
} = require("../controllers/clientsController");
const { protect, hasPermission } = require("../middlewares/auth");

router.use(protect);
router.get("/", hasPermission("clients.view"), listClients);
router.post("/", hasPermission("clients.create"), createClient);
router.get("/:id", hasPermission("clients.view"), getClient);
router.patch("/:id", hasPermission("clients.edit"), updateClient);
router.delete("/:id", hasPermission("clients.delete"), deleteClient);

module.exports = router;
