const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "fasttrack_admin_secret_2026";
const JWT_EXPIRY = "7d";

// Role constants for RBAC
const ROLES = {
    USER: "customer",
    ADMIN: "admin",
    MANAGER: "manager",
    CUSTOMER_SERVICE: "customer_service",
    VENDOR: "vendor"
};

const protect = async (req, res, next) => {
    let token;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized to access this route" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
};

const adminOnly = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    if (req.user.role !== ROLES.ADMIN && req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    next();
};

const roleBasedAccess = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required" });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied. Allowed roles: ${allowedRoles.join(", ")}` });
        }
        next();
    };
};

const requireAdmin = roleBasedAccess(ROLES.ADMIN);

module.exports = { protect, adminOnly, roleBasedAccess, requireAdmin, ROLES };
