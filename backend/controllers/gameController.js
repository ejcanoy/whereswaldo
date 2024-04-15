const Game = require("../models/game")
const asyncHandler = require("express-async-handler")


exports.game_get_all = asyncHandler(async (req, res) => {
    try {
        const result = await Game.find({}).exec();
        if (!result) {
            return res.status(404).send("Map not found");
        }
        console.log(result);
        return res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

exports.game_post = asyncHandler(async (req,res) => {
    const game = new Game({
        name: req.body.name,
        startTime: req.body.startTime,
        endTime: req.body.endTime
    })

    const result = await game.save();
    return res.send(result);
})