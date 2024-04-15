const express = require("express");
const router = express.Router();
const map_controller = require("../controllers/mapController");

router.get('/:mapid', map_controller.map_get);
router.get('/', map_controller.map_get_all);

module.exports = router;