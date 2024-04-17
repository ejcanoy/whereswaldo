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
        const result = await Game.findById(req.params.gameid);
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
        mapid: req.body.mapid,
        name: null,
        startTime: new Date(),
        endTime: null
    })

    const result = await game.save();
    return res.send(result);
})


function checkMove(x, y, charLocRangeX, charLocRangeY) {
    return (x > charLocRangeX[0] && x < charLocRangeX[1] && y > charLocRangeY[0] && y < charLocRangeY[1]);
}

exports.game_move_post = asyncHandler(async (req, res) => {
    // get game 
    // get map with the mapid and get the charlocations
    // get the move
    // verify if the move is in the location of the character

    const {characterName, x, y} = req.body;

    const game = await Game.findById(req.params.gameid)
                .populate("mapid")
                .exec();
    const data = await game.toJSON();

    const charLocRangeX = data.mapid.characterLocations[characterName].x;
    const charLocRangeY = data.mapid.characterLocations[characterName].y;

    if(checkMove(x,y,charLocRangeX,charLocRangeY)) {
        // save the move
            // need to save name, x, y
            // need to add it to the model
                // just add moves as a field
                // add it to the post to create a new game too 
        // res.send true
    }
    // res send false
    res.send();
})

exports.game_put = asyncHandler(async (req, res) => {
    const game = await Game.findByIdAndUpdate(req.params.gameid, {name: req.body.name, endTime: new Date()}, {new: true});

    if (!game) {
        const err = new Error("Game not found");
        err.status = 404;
        return next(err);
    }

    return res.send(game);
})

exports.game_delete = asyncHandler(async (req, res) => {
    const game = await Game.findByIdAndDelete(req.params.gameid);
    return res.send(game);
})