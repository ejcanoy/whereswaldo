const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MapSchema = new Schema({
    name: {type: String},
    characterLocations: Object
})

MapSchema.virtual("url").get(function (){
    return `/map/${this._id}`
})

module.exports = mongoose.model("Map", MapSchema);