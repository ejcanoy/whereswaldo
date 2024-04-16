const Game = require("../models/game")
const asyncHandler = require("express-async-handler")


exports.game_get_all = asyncHandler(async (req, res) => {
    try {
        const result = await Game.find({}).exec();
        if (!result) {
            return res.status(404).send("Games not found");
        }
        return res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

exports.game_get = asyncHandler(async (req,res) => {
    try {
        const result = await Game.findById(req.params.mapid);
        if (!result) {
            return res.status(404).send("Game not found");
        }
        return res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
})

exports.game_post = asyncHandler(async (req,res) => {
    const game = new Game({
        name: null,
        startTime: new Date(),
        endTime: null
    })

    const result = await game.save();
    return res.send(result);
})

exports.game_put = asyncHandler(async (req, res) => {
    const game = await Game.findByIdAndUpdate(req.params.mapid, {name: req.body.name, endTime: new Date()}, {new: true});

    if (!game) {
        const err = new Error("Game not found");
        err.status = 404;
        return next(err);
    }

    return res.send(game);
})

exports.game_delete = asyncHandler(async (req, res) => {
    const game = await Game.findByIdAndDelete(req.params.mapid);
    return res.send(game);
})