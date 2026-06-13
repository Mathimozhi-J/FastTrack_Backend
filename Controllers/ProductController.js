const express = require("express");
const router = express.Router();
const Product = require("../Modals/ProductModel");

const getAllProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        const query = { isActive: { $ne: false } };
        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: "i" };
        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json({ data: products });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ data: product });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { getAllProducts, getProductById };
