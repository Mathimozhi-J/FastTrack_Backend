const jwt = require("jsonwebtoken");
const User = require("../Modals/UserModel");
const Product = require("../Modals/ProductModel");
const Order = require("../Modals/OrderModel");

const JWT_SECRET = process.env.JWT_SECRET || "fasttrack_admin_secret_2026";
const JWT_EXPIRY = "7d";

// ── Auth ────────────────────────────────────────────────
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        let userData;

        const user = await User.findOne({ email });
        if (user && user.password === password) {
            if (user.role !== "admin") {
                return res.status(403).json({ message: "Access denied. Admin only." });
            }
            userData = { id: user._id, email: user.email, role: user.role, firstname: user.firstname, lastname: user.lastname };
        } else if (email === "admin@fasttrack.com" && password === "admin123") {
            // Fallback: issue token for hardcoded admin credentials
            userData = { id: "fallback-admin", email, role: "admin", firstname: "Super", lastname: "Admin" };
        } else {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: userData.id, email: userData.email, role: userData.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        res.status(200).json({
            message: "Admin login successful",
            data: { _id: userData.id, firstname: userData.firstname, lastname: userData.lastname, email: userData.email, role: userData.role, isAdmin: true, token }
        });
    } catch (e) { res.status(500).json({ message: "Login error", error: e.message }); }
};

// ── Users ────────────────────────────────────────────────
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
        const body = req.body || {};
        if (!body.name)     return res.status(400).json({ message: "Product name is required" });
        if (!body.price)    return res.status(400).json({ message: "Price is required" });
        if (!body.category) return res.status(400).json({ message: "Category is required" });

        const productData = {
            name:          body.name.trim(),
            category:      body.category,
            price:         Number(body.price),
            originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
            discount:      body.discount ? Number(body.discount) : 0,
            stock:         body.stock !== undefined && body.stock !== "" ? Number(body.stock) : 50,
            weight:        body.weight || "",
            description:   body.description || "",
            image:         body.image || "",
            isActive:      body.isActive === false || body.isActive === "false" ? false : true,
            isPublished:   true,
        };
        const product = await Product.create(productData);
        res.status(201).json({ message: "Product created", data: product });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const updateProduct = async (req, res) => {
    try {
        const body = req.body || {};
        const updateData = {};
        if (body.name      !== undefined) updateData.name          = body.name.trim();
        if (body.category  !== undefined) updateData.category      = body.category;
        if (body.price     !== undefined) updateData.price         = Number(body.price);
        if (body.originalPrice !== undefined && body.originalPrice !== "") updateData.originalPrice = Number(body.originalPrice);
        if (body.discount  !== undefined) updateData.discount      = Number(body.discount);
        if (body.stock     !== undefined && body.stock !== "") updateData.stock = Number(body.stock);
        if (body.weight    !== undefined) updateData.weight        = body.weight;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.image     !== undefined) updateData.image         = body.image;
        updateData.isActive = body.isActive === false || body.isActive === "false" ? false : true;

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
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

// ── Orders ────────────────────────────────────────────
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.json({ message: "Orders retrieved", data: orders });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.id },
            { $set: { status: req.body?.status || "Order Placed" } },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json({ message: "Status updated", data: order });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── Analytics ──────────────────────────────────────────
const getStats = async (req, res) => {
    try {
        const totalUsers    = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const usersByRole   = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);
        res.json({ data: { totalUsers, totalProducts, usersByRole } });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = {
    adminLogin,
    getAllUsers, updateUserRole, deleteUser,
    getAllProducts, createProduct, updateProduct, deleteProduct,
    getAllOrders, updateOrderStatus,
    getStats
};
