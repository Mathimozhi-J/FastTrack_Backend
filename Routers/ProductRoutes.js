const express = require("express");
const router  = express.Router();
const Product = require("../Modals/ProductModel");

// GET all active products (public - website)
router.get("/", async (req, res) => {
    try {
        const { search, category } = req.query;
        const query = { isActive: true };
        if (category) query.category = category;
        if (search)   query.name = { $regex: search, $options: "i" };
        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json({ data: products });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET single product
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ data: product });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
