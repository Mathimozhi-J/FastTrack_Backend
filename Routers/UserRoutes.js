const express = require("express");
const router  = express.Router();
const {
    signupUser,
    loginUser,
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount
} = require("../Controllers/UserControllers");

// CREATE
router.post("/signup",  signupUser);
// READ
router.post("/login",   loginUser);
router.get("/profile/:id", getProfile);
// UPDATE
router.put("/profile/:id",  updateProfile);
router.put("/password/:id", changePassword);
// DELETE
router.delete("/profile/:id", deleteAccount);

module.exports = router;
