const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
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
  agentName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;
