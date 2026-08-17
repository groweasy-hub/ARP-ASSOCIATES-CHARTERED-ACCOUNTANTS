const express = require("express");
const router = express.Router();
const { getPushStatus, subscribe, unsubscribe } = require("../controllers/pushController");
const { protect } = require("../middlewares/auth");

router.use(protect);
router.get("/status", getPushStatus);
router.post("/subscribe", subscribe);
router.delete("/unsubscribe", unsubscribe);

module.exports = router;
