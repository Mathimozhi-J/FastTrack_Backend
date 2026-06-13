const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ["%", "flat"], default: "%" },
    value: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    expiry: { type: Date },
    limit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

CouponSchema.index({ expiry: 1 });

module.exports = mongoose.model("Coupon", CouponSchema);