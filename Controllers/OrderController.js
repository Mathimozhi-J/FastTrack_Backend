const Order = require("../Modals/OrderModel");
const Delivery = require("../Modals/DeliveryModel");

module.exports = {
    getAllOrders: async (req, res) => {
        try {
            const { email } = req.query;
            const query = email ? { userEmail: email } : {};
            const orders = await Order.find(query).sort({ createdAt: -1 });
            res.json({ success: true, data: orders });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    getOrderById: async (req, res) => {
        try {
            const order = await Order.findOne({ orderId: req.params.id });
            if (!order) return res.status(404).json({ success: false, message: "Order not found" });
            res.json({ success: true, data: order });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    createOrder: async (req, res) => {
        try {
            let orderData = { ...req.body };

            if (!orderData.agentName) {
                try {
                    const partner = await Delivery.findOne({ isAvailable: true, status: "Active" }).sort({ orders: 1 });
                    if (partner) {
                        orderData.agentName = partner.name;
                        await Delivery.findByIdAndUpdate(partner._id, { $inc: { orders: 1 } });
                    }
                } catch {}
            }

            const order = new Order(orderData);
            const saved = await order.save();
            res.status(201).json({ success: true, data: saved });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    updateOrderStatus: async (req, res) => {
        try {
            const updateFields = { status: req.body?.status || "Order Placed" };
            if (req.body?.agentName) updateFields.agentName = req.body.agentName;
            const updated = await Order.findOneAndUpdate(
                { orderId: req.params.id },
                { $set: updateFields },
                { new: true }
            );
            res.json({ success: true, data: updated });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    },

    reorder: async (req, res) => {
        try {
            const { email } = req.body;
            const order = await Order.findOne({ orderId: req.params.id, userEmail: email });
            if (!order) return res.status(404).json({ success: false, message: "Order not found" });
            res.json({ success: true, data: order });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
};