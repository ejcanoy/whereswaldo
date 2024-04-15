const express = require("express");
const router = express.Router()
const game_controller = require('../controllers/gameController');


router.get('/' , game_controller.game_get_all);
router.post('/', game_controller.game_post);



module.exports  = router