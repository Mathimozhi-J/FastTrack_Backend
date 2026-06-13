const express = require("express");
const router  = express.Router();
const {
    createReview,
    getProductReviews,
    getAllReviews,
    approveReview,
    deleteReview,
    getReviewStats,
} = require("../Controllers/ReviewController");

router.post("/",                      createReview);        // user submits review
router.get("/product/:productId",     getProductReviews);   // public: approved reviews for a product
router.get("/stats",                  getReviewStats);       // public: avg rating + count per product
router.get("/admin/all",              getAllReviews);         // admin: all reviews
router.put("/approve/:id",            approveReview);        // admin: approve
router.delete("/:id",                 deleteReview);         // admin: delete

module.exports = router;
