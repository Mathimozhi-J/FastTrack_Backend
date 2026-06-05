const User = require("../Modals/UserModel");

// ── CREATE: Register ────────────────────────────────────
const signupUser = async (req, res) => {
    try {
        const { firstname, lastname, email, phone, password } = req.body;
        if (!firstname || !email || !password)
            return res.status(400).json({ message: "firstname, email and password are required" });

        if (await User.findOne({ email }))
            return res.status(400).json({ message: "User already exists with this email" });

        const user = await User.create({ firstname, lastname, email, phone, password, role: "customer", isActive: true });
        res.status(201).json({
            message: "User registered successfully",
            data: { _id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email, phone: user.phone, role: user.role }
        });
    } catch (e) { res.status(500).json({ message: "Error registering user", error: e.message }); }
};

// ── READ: Login ─────────────────────────────────────────
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email and password are required" });

        const user = await User.findOne({ email });
        if (!user || user.password !== password)
            return res.status(401).json({ message: "Invalid email or password" });

        if (!user.isActive)
            return res.status(403).json({ message: "Account is deactivated. Contact support." });

        res.status(200).json({
            message: "Login successful",
            data: { _id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email, phone: user.phone, role: user.role, isAdmin: user.role === "admin" }
        });
    } catch (e) { res.status(500).json({ message: "Login error", error: e.message }); }
};

// ── READ: Get Profile ───────────────────────────────────
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Profile fetched", data: user });
    } catch (e) { res.status(500).json({ message: "Error fetching profile", error: e.message }); }
};

// ── UPDATE: Edit Profile ────────────────────────────────
const updateProfile = async (req, res) => {
    try {
        const { firstname, lastname, phone } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { firstname, lastname, phone },
            { new: true, runValidators: true }
        ).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Profile updated successfully", data: user });
    } catch (e) { res.status(500).json({ message: "Error updating profile", error: e.message }); }
};

// ── UPDATE: Change Password ─────────────────────────────
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.password !== currentPassword)
            return res.status(401).json({ message: "Current password is incorrect" });
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (e) { res.status(500).json({ message: "Error changing password", error: e.message }); }
};

// ── DELETE: Remove Account ──────────────────────────────
const deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (e) { res.status(500).json({ message: "Error deleting account", error: e.message }); }
};

module.exports = { signupUser, loginUser, getProfile, updateProfile, changePassword, deleteAccount };
