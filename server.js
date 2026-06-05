const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.listen(5000,() => {
    console.log("Port is running on 5000");
    }
);

const userroutes   = require("./Routers/UserRoutes");
const adminRoutes  = require("./Routers/AdminRoutes");
const orderRoutes  = require("./Routers/OrderRoutes");
app.use("/api/user",   userroutes);
app.use("/api/admin",  adminRoutes);
app.use("/api/orders", orderRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => { console.log("Connection to mongo_db Successfull..."); })
    .catch((err) => { console.log("Connection to mongo_db FAILED. ", err); })