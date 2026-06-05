const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getUserStats
} = require("../Controllers/AdminUserController");

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/users/stats", getUserStats);

module.exports = router;