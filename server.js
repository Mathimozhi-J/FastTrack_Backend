const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Debugging: Check if Environment variables are loading
if (!process.env.MONGO_URL) {
    console.error("FATAL ERROR: MONGO_URL is not defined in .env file");
    process.exit(1);
}

const userroutes   = require("./Routers/UserRoutes");
const adminRoutes  = require("./Routers/AdminRoutes");
app.use("/api/user",   userroutes);
app.use("/api/admin",  adminRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("Connection to mongo_db Successfull..."); })
    .catch((err) => { console.log("Connection to mongo_db FAILED. ", err); })

app.listen(5000,() => {
    console.log("Port is running on 5000");
});