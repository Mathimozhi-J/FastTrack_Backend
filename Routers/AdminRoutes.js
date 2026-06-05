const express = require("express");
const router  = express.Router();
const {
    getAllUsers, updateUserRole, deleteUser,
    getAllProducts, createProduct, updateProduct, deleteProduct,
    getAllOrders, updateOrderStatus,
    getStats
} = require("../Controllers/AdminController");

// Users
router.get("/users",            getAllUsers);
router.put("/users/:id/role",   updateUserRole);
router.delete("/users/:id",     deleteUser);

// Products
router.get("/products",         getAllProducts);
router.post("/products",        createProduct);
router.put("/products/:id",     updateProduct);
router.delete("/products/:id",  deleteProduct);

// Orders
router.get("/orders",           getAllOrders);
router.put("/orders/:id",       updateOrderStatus);

// Analytics
router.get("/stats",            getStats);

module.exports = router;
