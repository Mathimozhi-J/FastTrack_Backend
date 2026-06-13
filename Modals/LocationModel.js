const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    state: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    pincode: { type: String, required: true, unique: true },
    deliveryAvailable: { type: Boolean, default: true },
    deliveryTime: { type: String, default: "10-15 min" },
    deliveryCharge: { type: Number, default: 0 },
    minimumOrderAmount: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    createdAt: { type: Date, default: Date.now }
});

locationSchema.index({ pincode: 1 });
locationSchema.index({ city: 1 });
locationSchema.index({ state: 1 });

module.exports = mongoose.model("Location", locationSchema);