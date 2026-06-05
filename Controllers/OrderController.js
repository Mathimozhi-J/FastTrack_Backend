const Order = require("../Modals/OrderModel");

// CREATE order
const createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body);
        res.status(201).json({ message: "Order placed successfully", data: order });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

// GET orders by user email
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
        res.json({ data: orders });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

// CANCEL order
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.id },
            { status: "Cancelled" },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json({ message: "Order cancelled", data: order });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

module.exports = { createOrder, getUserOrders, cancelOrder };
