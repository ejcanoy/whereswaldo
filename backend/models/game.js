const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    mapid: {type: Schema.Types.ObjectId, ref: "Map"},
    name: {type: Schema.Types.String},
    startTime: {type: Schema.Types.Date},
    endTime: {type: Schema.Types.Date}
})

module.exports = mongoose.model("Game", GameSchema);