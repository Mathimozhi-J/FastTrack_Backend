const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name:          { type: String, required: true },
    category:      { type: String, required: true },
    price:         { type: Number, required: true },
    originalPrice: { type: Number },
    discount:      { type: Number, default: 0 },
    weight:        { type: String },
    stock:         { type: Number, default: 0 },
    image:         { type: String },
    description:   { type: String },
    isActive:      { type: Boolean, default: true },
    isPublished:   { type: Boolean, default: true, index: true },
    createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", ProductSchema);
