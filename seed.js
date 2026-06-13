const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./Modals/UserModel");
const Category = require("./Modals/CategoryModel");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/";

mongoose.connect(MONGO_URL).then(async () => {
  console.log("Connected to MongoDB");

  // Create admin user if not exists
  const adminExists = await User.findOne({ email: "admin@fasttrack.com" });
  if (!adminExists) {
    await User.create({
      firstname: "Admin",
      lastname: "User",
      email: "admin@fasttrack.com",
      phone: "9999999999",
      password: "admin123",
      role: "admin"
    });
    console.log("Admin user created: admin@fasttrack.com / admin123");
  } else {
    console.log("Admin user already exists");
  }

  // Seed categories
  const count = await Category.countDocuments();
  if (count === 0) {
    const categories = [
      { name: "Fruits", section: "Groceries", emoji: "??", bg: "#fff7ed", border: "#ffcaa4", color: "#ea580c", sectionIcon: "fas fa-apple-alt", sectionColor: "#ea580c" },
      { name: "Vegetables", section: "Groceries", emoji: "??", bg: "#f0fdf4", border: "#bbf7d0", color: "#16a34a", sectionIcon: "fas fa-carrot", sectionColor: "#16a34a" },
      { name: "Dairy", section: "Groceries", emoji: "??", bg: "#eff6ff", border: "#bfdbfe", color: "#2563eb", sectionIcon: "fas fa-cheese", sectionColor: "#2563eb" },
      { name: "Bakery", section: "Groceries", emoji: "??", bg: "#fef2f2", border: "#fecaca", color: "#dc2626", sectionIcon: "fas fa-bread-slice", sectionColor: "#dc2626" },
      { name: "Snacks", section: "Groceries", emoji: "??", bg: "#fefce8", border: "#fef08a", color: "#ca8a04", sectionIcon: "fas fa-cookie-bite", sectionColor: "#ca8a04" },
      { name: "Beverages", section: "Groceries", emoji: "??", bg: "#f5f3ff", border: "#ddd6fe", color: "#7c3aed", sectionIcon: "fas fa-glass-cheers", sectionColor: "#7c3aed" },
      { name: "Meat", section: "Groceries", emoji: "??", bg: "#fff1f2", border: "#ffe4e6", color: "#db2777", sectionIcon: "fas fa-drumstick-bite", sectionColor: "#db2777" },
      { name: "Oil & Ghee", section: "Groceries", emoji: "??", bg: "#fff7ed", border: "#ffcaa4", color: "#ea580c", sectionIcon: "fas fa-oil-can", sectionColor: "#ea580c" },
      { name: "Masala & Spices", section: "Groceries", emoji: "??", bg: "#fefce8", border: "#fef08a", color: "#ca8a04", sectionIcon: "fas fa-seedling", sectionColor: "#ca8a04" },
      { name: "Rice & Grains", section: "Groceries", emoji: "??", bg: "#f0fdf4", border: "#bbf7d0", color: "#16a34a", sectionIcon: "fas fa-wheat", sectionColor: "#16a34a" },
      { name: "Dal & Pulses", section: "Groceries", emoji: "??", bg: "#fefce8", border: "#fef08a", color: "#ca8a04", sectionIcon: "fas fa-seedling", sectionColor: "#ca8a04" },
      { name: "Seafood", section: "Groceries", emoji: "??", bg: "#eff6ff", border: "#bfdbfe", color: "#2563eb", sectionIcon: "fas fa-fish", sectionColor: "#2563eb" },
      { name: "Personal Care", section: "Others", emoji: "??", bg: "#fef2f2", border: "#fecaca", color: "#dc2626", sectionIcon: "fas fa-spa", sectionColor: "#dc2626" },
      { name: "Household", section: "Others", emoji: "??", bg: "#f5f3ff", border: "#ddd6fe", color: "#7c3aed", sectionIcon: "fas fa-home", sectionColor: "#7c3aed" },
      { name: "Condiments & Sauces", section: "Others", emoji: "??", bg: "#fff7ed", border: "#ffcaa4", color: "#ea580c", sectionIcon: "fas fa-utensils", sectionColor: "#ea580c" },
    ];
    await Category.insertMany(categories);
    console.log("Categories seeded");
  } else {
    console.log("Categories already exist");
  }

  process.exit(0);
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});
