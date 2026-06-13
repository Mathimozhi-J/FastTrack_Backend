const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../Utils/authMiddleware");
const upload = require("../Utils/upload");
const Category = require("../Modals/CategoryModel");
const Delivery = require("../Modals/DeliveryModel");
const Review = require("../Modals/ReviewModel");
const Coupon = require("../Modals/CouponModel");
const {
    adminLogin,
    getAllUsers, updateUserRole, deleteUser,
    getAllProducts, createProduct, updateProduct, deleteProduct,
    getAllOrders, updateOrderStatus,
    getStats
} = require("../Controllers/AdminController");

// Category endpoints
const CATEGORY_MESSAGES = {
    CREATED: "Category created",
    UPDATED: "Category updated",
    DELETED: "Category deactivated",
    NOT_FOUND: "Category not found"
};

const getAllCategories = async (req, res) => {
    try {
        const { search, section } = req.query;
        const query = {};
        if (search) query.name = { $regex: search, $options: "i" };
        if (section) query.section = section;
        const categories = await Category.find(query).sort({ createdAt: -1 });
        res.json({ message: "Categories retrieved", data: categories });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const createCategory = async (req, res) => {
    try {
        const category = await Category.create({ ...req.body, isPublished: true, isActive: true });
        res.status(201).json({ message: CATEGORY_MESSAGES.CREATED, data: category });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) return res.status(404).json({ message: CATEGORY_MESSAGES.NOT_FOUND });
        res.json({ message: CATEGORY_MESSAGES.UPDATED, data: category });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { isActive: false, isPublished: false },
            { new: true }
        );
        if (!category) return res.status(404).json({ message: CATEGORY_MESSAGES.NOT_FOUND });
        res.json({ message: CATEGORY_MESSAGES.DELETED, data: category });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── Coupons ───────────────────────────────────────────────
const COUPON_MESSAGES = {
    CREATED: "Coupon created",
    UPDATED: "Coupon updated",
    DELETED: "Coupon deactivated",
    NOT_FOUND: "Coupon not found"
};

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        res.json({ message: "Coupons retrieved", data: coupons });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create({ ...req.body, isPublished: true, isActive: true });
        res.status(201).json({ message: COUPON_MESSAGES.CREATED, data: coupon });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!coupon) return res.status(404).json({ message: COUPON_MESSAGES.NOT_FOUND });
        res.json({ message: COUPON_MESSAGES.UPDATED, data: coupon });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            { isActive: false, isPublished: false },
            { new: true }
        );
        if (!coupon) return res.status(404).json({ message: COUPON_MESSAGES.NOT_FOUND });
        res.json({ message: COUPON_MESSAGES.DELETED, data: coupon });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

// Delivery handlers
const getAllDeliveryPartners = async (req, res) => {
    try {
        const partners = await Delivery.find({});
        res.json({ data: partners });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const createDeliveryPartner = async (req, res) => {
    try {
        const partner = await Delivery.create(req.body);
        res.status(201).json({ message: "Partner created", data: partner });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const updateDeliveryPartner = async (req, res) => {
    try {
        const partner = await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!partner) return res.status(404).json({ message: "Partner not found" });
        res.json({ message: "Partner updated", data: partner });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const deleteDeliveryPartner = async (req, res) => {
    try {
        const partner = await Delivery.findByIdAndUpdate(
            req.params.id,
            { isAvailable: false, status: "Inactive" },
            { new: true }
        );
        if (!partner) return res.status(404).json({ message: "Partner not found" });
        res.json({ message: "Partner deactivated", data: partner });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

// Review handlers
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({});
        res.json({ data: reviews });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const updateReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!review) return res.status(404).json({ message: "Review not found" });
        res.json({ message: "Review updated", data: review });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found" });
        res.json({ message: "Review deleted" });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

// Auth
router.post("/login", adminLogin);

// Image upload
router.post("/upload-image", protect, adminOnly, upload.single("image"), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file provided" });
        res.json({ message: "Image uploaded", data: { url: `/images/products/${req.file.filename}` } });
    } catch (e) { res.status(500).json({ message: e.message }); }
});

// Categories
router.get("/categories", protect, adminOnly, getAllCategories);
router.post("/categories", protect, adminOnly, createCategory);
router.put("/categories/:id", protect, adminOnly, updateCategory);
router.delete("/categories/:id", protect, adminOnly, deleteCategory);

// Users
router.get("/users",          protect, adminOnly, getAllUsers);
router.put("/users/:id/role", protect, adminOnly, updateUserRole);
router.delete("/users/:id",   protect, adminOnly, deleteUser);

// Products
router.get("/products",        protect, adminOnly, getAllProducts);
router.post("/products",       protect, adminOnly, createProduct);
router.put("/products/:id",    protect, adminOnly, updateProduct);
router.delete("/products/:id", protect, adminOnly, deleteProduct);

// Orders
router.get("/orders",         protect, adminOnly, getAllOrders);
router.put("/orders/:id",     protect, adminOnly, updateOrderStatus);

// Analytics
router.get("/stats",          protect, adminOnly, getStats);

// Delivery Partners
router.get("/delivery",       protect, adminOnly, getAllDeliveryPartners);
router.post("/delivery",      protect, adminOnly, createDeliveryPartner);
router.put("/delivery/:id",   protect, adminOnly, updateDeliveryPartner);
router.delete("/delivery/:id", protect, adminOnly, deleteDeliveryPartner);

// Reviews
router.get("/reviews",        protect, adminOnly, getAllReviews);
router.put("/reviews/:id",    protect, adminOnly, updateReview);
router.delete("/reviews/:id", protect, adminOnly, deleteReview);

// Coupons
router.get("/coupons",        protect, adminOnly, getAllCoupons);
router.post("/coupons",       protect, adminOnly, createCoupon);
router.put("/coupons/:id",    protect, adminOnly, updateCoupon);
router.delete("/coupons/:id", protect, adminOnly, deleteCoupon);

module.exports = router;