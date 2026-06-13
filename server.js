const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Debugging: Check if Environment variables are loading
if (!process.env.MONGO_URL) {
    console.error("FATAL ERROR: MONGO_URL is not defined in .env file");
    process.exit(1);
}

const userroutes    = require("./Routers/UserRoutes");
const productRoutes = require("./Routers/ProductRoutes");
const orderRoutes   = require("./Routers/OrderRoutes");
const adminRoutes   = require("./Routers/AdminRoutes");
const reviewRoutes  = require("./Routers/ReviewRoutes");
const locationRoutes = require("./Routers/LocationRoutes");
app.use("/api/user",     userroutes);
app.use("/api/products", productRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/admin",    adminRoutes);
app.use("/api/reviews",  reviewRoutes);
app.use("/api/locations", locationRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("Connection to mongo_db Successfull..."); })
    .catch((err) => { console.log("Connection to mongo_db FAILED. ", err); })

app.listen(5000,() => {
    console.log("Port is running on 5000");
});