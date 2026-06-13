const express = require("express");
const router = express.Router();
const { getAllOrders, getOrderById, createOrder, updateOrderStatus, reorder } = require("../Controllers/OrderController");

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id/status", updateOrderStatus);
router.post("/:id/reorder", reorder);

module.exports = router;