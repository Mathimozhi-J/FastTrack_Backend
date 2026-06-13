const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../Utils/authMiddleware");
const {
    getAllLocations,
    searchLocations,
    checkDelivery,
    createLocation,
    updateLocation,
    deleteLocation,
    toggleLocationStatus,
    bulkImportLocations,
    exportLocations
} = require("../Controllers/LocationController");

// Public routes
router.get("/search", searchLocations);
router.get("/check/:pincode", checkDelivery);

// Admin routes
router.get("/", protect, adminOnly, getAllLocations);
router.post("/", protect, adminOnly, createLocation);
router.put("/:id", protect, adminOnly, updateLocation);
router.delete("/:id", protect, adminOnly, deleteLocation);
router.patch("/:id/toggle", protect, adminOnly, toggleLocationStatus);
router.post("/bulk-import", protect, adminOnly, bulkImportLocations);
router.get("/export", protect, adminOnly, exportLocations);

module.exports = router;