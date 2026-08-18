const express = require("express");
const router = express.Router();
const { createTask, listTasks, reassignTask, updateTaskDetails, updateTaskStatus } = require("../controllers/tasksController");
const { protect } = require("../middlewares/auth");

router.use(protect);
router.get("/", listTasks);
router.post("/", createTask);
router.patch("/:id", updateTaskDetails);
router.patch("/:id/reassign", reassignTask);
router.patch("/:id/status", updateTaskStatus);

module.exports = router;
