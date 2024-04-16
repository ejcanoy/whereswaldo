const express = require("express");
const router = express.Router()
const game_controller = require('../controllers/gameController');


router.get('/' , game_controller.game_get_all);
router.get('/:mapid', game_controller.game_get);
router.post('/', game_controller.game_post);
router.put('/:mapid', game_controller.game_put);
router.delete('/:mapid', game_controller.game_delete);



module.exports  = router