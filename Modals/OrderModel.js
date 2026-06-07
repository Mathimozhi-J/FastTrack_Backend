const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, index: true },
  userEmail: { type: String, index: true },
  items: { type: Array, default: [] },
  total: { type: Number },
  status: { type: String, default: "Order Placed" },
  date: { type: String },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;
