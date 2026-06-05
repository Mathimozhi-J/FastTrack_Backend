const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    orderId:     { type: String, required: true, unique: true },
    userName:    { type: String },
    userEmail:   { type: String },
    items:       { type: Array, default: [] },
    total:       { type: Number, default: 0 },
    status:      { type: String, enum: ["Order Placed","Processing","Out for Delivery","Delivered","Cancelled"], default: "Order Placed" },
    paymentMode: { type: String, default: "UPI" },
    address:     { type: String },
    date:        { type: String },
    createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
