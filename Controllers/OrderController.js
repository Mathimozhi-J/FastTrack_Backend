const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = mongoose.models.Order || mongoose.model("Order", new mongoose.Schema({
  orderId: { type: String, unique: true, index: true },
  id: { type: String },
  userEmail: { type: String, index: true },
  userName: { type: String },
  phone: { type: String },
  address: { type: String },
  addressDetails: { type: Object },
  items: { type: Array, default: [] },
  subtotal: { type: Number },
  delivery: { type: Number },
  tax: { type: Number },
  total: { type: Number },
  paymentMode: { type: String },
  status: { type: String, default: "Order Placed" },
  date: { type: String },
  time: { type: String },
  deliveryDate: { type: String },
  deliveryOption: { type: String },
  createdAt: { type: Date, default: Date.now },
}));

router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    const query = email ? { userEmail: email } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    const saved = await order.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const updated = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { $set: { status: req.body.status } },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post("/:id/reorder", async (req, res) => {
  try {
    const { email } = req.body;
    const order = await Order.findOne({ orderId: req.params.id, userEmail: email });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
