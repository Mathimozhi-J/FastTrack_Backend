const express = require("express");
const router  = express.Router();
const { createOrder, getUserOrders, cancelOrder } = require("../Controllers/OrderController");

router.post("/",                createOrder);
router.get("/user/:email",      getUserOrders);
router.put("/cancel/:id",       cancelOrder);

module.exports = router;
