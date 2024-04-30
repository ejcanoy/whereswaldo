const Map = require("../models/map")
const asyncHandler = require("express-async-handler")

exports.map_get = asyncHandler(async (req, res) => {
    try {
        const result = await Map.findById(req.params.mapid).exec();
        if (!result) {
            return res.status(404).send("Map not found");
        }
        return res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});


exports.map_get_all = asyncHandler(async (req, res) => {
    try {
        const result = await Map.find({}).exec();
        if (!result) {
            return res.status(404).send("Map not found");
        }
        return res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});