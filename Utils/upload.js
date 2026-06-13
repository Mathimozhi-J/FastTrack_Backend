const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

const UPLOAD_DIR = path.join(__dirname, "../public/images/products");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename:    (req, file, cb) => {
        const slug = file.originalname
            .toLowerCase()
            .replace(/\.[^.]+$/, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${slug}-${Date.now()}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only image files allowed"), false);
};

module.exports = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });
