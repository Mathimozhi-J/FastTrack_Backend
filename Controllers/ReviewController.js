const Review  = require("../Modals/ReviewModel");
const Product = require("../Modals/ProductModel");

// CREATE — user submits a review (pending approval)
const createReview = async (req, res) => {
    try {
        const { productId, productName, userId, customer, rating, comment } = req.body;

        if (!productId)      return res.status(400).json({ message: "productId is required" });
        if (!customer?.trim()) return res.status(400).json({ message: "customer name is required" });
        if (!rating || rating < 1 || rating > 5)
            return res.status(400).json({ message: "rating must be between 1 and 5" });
        if (!comment?.trim()) return res.status(400).json({ message: "comment is required" });

        const review = await Review.create({
            productId:   String(productId),
            productName: productName || "",
            userId:      userId || "",
            customer:    customer.trim(),
            rating:      Number(rating),
            comment:     comment.trim(),
            approved:    false,
        });

        res.status(201).json({ message: "Review submitted, pending admin approval", data: review });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// READ — get approved reviews for a product (public)
const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            productId: String(req.params.productId),
            approved: true,
        }).sort({ createdAt: -1 });
        res.json({ data: reviews });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// READ — get all reviews (admin)
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        res.json({ data: reviews });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// UPDATE — admin approves a review
const approveReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { approved: true },
            { new: true }
        );
        if (!review) return res.status(404).json({ message: "Review not found" });

        // Update avg rating on product if it's a MongoDB product
        try {
            const allApproved = await Review.find({ productId: review.productId, approved: true });
            const avg = allApproved.reduce((s, r) => s + r.rating, 0) / allApproved.length;
            await Product.findByIdAndUpdate(review.productId, {
                avgRating:   Math.round(avg * 10) / 10,
                reviewCount: allApproved.length,
            });
        } catch { /* productId may not be a MongoDB _id — skip */ }

        res.json({ message: "Review approved", data: review });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// DELETE — admin deletes a review
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: "Review not found" });
        res.json({ message: "Review deleted" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// GET stats — average rating + count per product (for admin dashboard)
const getReviewStats = async (req, res) => {
    try {
        const stats = await Review.aggregate([
            { $match: { approved: true } },
            { $group: {
                _id:       "$productId",
                avgRating: { $avg: "$rating" },
                count:     { $sum: 1 },
                productName: { $first: "$productName" },
            }},
            { $sort: { count: -1 } },
        ]);
        res.json({ data: stats });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

module.exports = { createReview, getProductReviews, getAllReviews, approveReview, deleteReview, getReviewStats };
