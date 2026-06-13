const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: String,
    emoji: String,
    bg: String,
    border: String,
    color: String,
    section: { type: String, default: "Other" },
    isPublished: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true, index: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Category", categorySchema);