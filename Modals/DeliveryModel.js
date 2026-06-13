const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: { type: String, enum: ["Bike", "Scooter", "Truck"], default: "Bike" },
    orders: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
});

module.exports = mongoose.model("Delivery", deliverySchema);