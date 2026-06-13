const Location = require("../Modals/LocationModel");

const formatLocation = (loc) => ({
    _id: loc._id,
    state: loc.state,
    city: loc.city,
    area: loc.area,
    pincode: loc.pincode,
    deliveryAvailable: loc.deliveryAvailable,
    deliveryTime: loc.deliveryTime,
    deliveryCharge: loc.deliveryCharge,
    minimumOrderAmount: loc.minimumOrderAmount,
    status: loc.status,
    createdAt: loc.createdAt
});

exports.getAllLocations = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 20 } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { state: { $regex: search, $options: "i" } },
                { city: { $regex: search, $options: "i" } },
                { area: { $regex: search, $options: "i" } },
                { pincode: { $regex: search, $options: "i" } }
            ];
        }
        if (status) query.status = status;
        const locations = await Location.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        const total = await Location.countDocuments(query);
        res.json({ message: "Locations retrieved", data: locations.map(formatLocation), total });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.searchLocations = async (req, res) => {
    try {
        const { q } = req.query;
        const query = {
            status: "Active",
            deliveryAvailable: true
        };
        if (q) {
            query.$or = [
                { state: { $regex: q, $options: "i" } },
                { city: { $regex: q, $options: "i" } },
                { area: { $regex: q, $options: "i" } },
                { pincode: { $regex: q, $options: "i" } }
            ];
        }
        const locations = await Location.find(query).limit(20);
        res.json({ message: "Search results", data: locations.map(formatLocation) });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.checkDelivery = async (req, res) => {
    try {
        const { pincode } = req.params;
        const location = await Location.findOne({ pincode, status: "Active", deliveryAvailable: true });
        if (location) {
            res.json({
                message: "Delivery available",
                data: {
                    available: true,
                    deliveryTime: location.deliveryTime,
                    deliveryCharge: location.deliveryCharge,
                    minimumOrderAmount: location.minimumOrderAmount,
                    location: formatLocation(location)
                }
            });
        } else {
            res.json({
                message: "Delivery not available",
                data: { available: false }
            });
        }
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.createLocation = async (req, res) => {
    try {
        const location = await Location.create(req.body);
        res.status(201).json({ message: "Location created", data: formatLocation(location) });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!location) return res.status(404).json({ message: "Location not found" });
        res.json({ message: "Location updated", data: formatLocation(location) });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.deleteLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) return res.status(404).json({ message: "Location not found" });
        res.json({ message: "Location deleted" });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.toggleLocationStatus = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) return res.status(404).json({ message: "Location not found" });
        location.status = location.status === "Active" ? "Inactive" : "Active";
        await location.save();
        res.json({ message: "Status updated", data: formatLocation(location) });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.bulkImportLocations = async (req, res) => {
    try {
        const locations = req.body.locations;
        if (!Array.isArray(locations)) {
            return res.status(400).json({ message: "Invalid format. Expected array of locations." });
        }
        const created = await Location.insertMany(locations.map(loc => ({
            ...loc,
            status: loc.status || "Active",
            deliveryAvailable: loc.deliveryAvailable !== undefined ? loc.deliveryAvailable : true
        })));
        res.json({ message: `${created.length} locations imported`, data: created });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.exportLocations = async (req, res) => {
    try {
        const locations = await Location.find({}).sort({ createdAt: -1 });
        res.json({ message: "Exported", data: locations.map(formatLocation) });
    } catch (e) { res.status(500).json({ message: e.message }); }
};