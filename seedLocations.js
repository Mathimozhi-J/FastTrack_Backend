const mongoose = require("mongoose");
const Location = require("./Modals/LocationModel");

const seedLocations = async () => {
    await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/grocery");

    const locations = [
        {
            state: "Tamil Nadu",
            city: "Chennai",
            area: "Adyar",
            pincode: "600020",
            deliveryAvailable: true,
            deliveryTime: "10-15 min",
            deliveryCharge: 20,
            minimumOrderAmount: 199,
            status: "Active"
        },
        {
            state: "Tamil Nadu",
            city: "Chennai",
            area: "T. Nagar",
            pincode: "600017",
            deliveryAvailable: true,
            deliveryTime: "10-15 min",
            deliveryCharge: 20,
            minimumOrderAmount: 199,
            status: "Active"
        },
        {
            state: "Karnataka",
            city: "Bangalore",
            area: "Koramangala",
            pincode: "560034",
            deliveryAvailable: true,
            deliveryTime: "15-20 min",
            deliveryCharge: 30,
            minimumOrderAmount: 149,
            status: "Active"
        },
        {
            state: "Maharashtra",
            city: "Mumbai",
            area: "Bandra",
            pincode: "400050",
            deliveryAvailable: true,
            deliveryTime: "10-15 min",
            deliveryCharge: 25,
            minimumOrderAmount: 199,
            status: "Active"
        },
        {
            state: "Delhi",
            city: "New Delhi",
            area: "Connaught Place",
            pincode: "110001",
            deliveryAvailable: true,
            deliveryTime: "15-20 min",
            deliveryCharge: 35,
            minimumOrderAmount: 299,
            status: "Active"
        }
    ];

    await Location.deleteMany({});
    await Location.insertMany(locations);
    console.log("Locations seeded successfully!");
    process.exit(0);
};

seedLocations().catch(console.error);