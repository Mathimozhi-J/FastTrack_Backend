const User    = require("../Modals/UserModel");
const Product = require("../Modals/ProductModel");
const Order   = require("../Modals/OrderModel");

// ── Users ──────────────────────────────────────────────
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json({ message: "Users retrieved", data: users });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const updateUserRole = async (req, res) => {
    try {
        const { role, permissions, isActive } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role, permissions, isActive }, { new: true }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Role updated", data: user });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted" });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── Products ───────────────────────────────────────────
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ data: products });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ message: "Product created", data: product });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product updated", data: product });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted" });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── Orders ─────────────────────────────────────────────
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json({ data: orders });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.id },
            { status: req.body.status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json({ message: "Order updated", data: order });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── Analytics ──────────────────────────────────────────
const getStats = async (req, res) => {
    try {
        const totalUsers    = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders   = await Order.countDocuments();
        const delivered     = await Order.countDocuments({ status: "Delivered" });
        const revenueData   = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]);
        const totalRevenue  = revenueData[0]?.total || 0;
        const usersByRole   = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);
        const ordersByStatus = await Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
        res.json({ data: { totalUsers, totalProducts, totalOrders, delivered, totalRevenue, usersByRole, ordersByStatus } });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = {
    getAllUsers, updateUserRole, deleteUser,
    getAllProducts, createProduct, updateProduct, deleteProduct,
    getAllOrders, updateOrderStatus,
    getStats
};
