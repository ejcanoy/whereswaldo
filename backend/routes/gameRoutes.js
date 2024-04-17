const express = require("express");
const router = express.Router()
const game_controller = require('../controllers/gameController');


router.get('/' , game_controller.game_get_all);
router.get('/:gameid', game_controller.game_get);
router.post('/', game_controller.game_post);
router.post('/:gameid/move', game_controller.game_move_post);
router.put('/:gameid', game_controller.game_put);
router.delete('/:gameid', game_controller.game_delete);



module.exports  = router