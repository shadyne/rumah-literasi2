const express = require('express');
const router = express.Router();

const TeritoriesController = require('../controllers/teritory.controller');

router.get('/', TeritoriesController.provinces);
router.get('/:province_id', TeritoriesController.cities);
router.get('/:province_id/:city_id', TeritoriesController.districts);

module.exports = router;
