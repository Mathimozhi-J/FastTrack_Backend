const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/OrderController");

router.get("/", orderController);
router.get("/:id", orderController);
router.post("/", orderController);
router.put("/:id/status", orderController);
router.post("/:id/reorder", orderController);

module.exports = router;
