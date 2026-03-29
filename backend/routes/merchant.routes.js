const express = require('express');
const router = express.Router();
const MerchantController = require('../controllers/merchant.controller');

const { authorize } = require('../middleware/authorize');
const { ROLES } = require('../libs/constant');

const superadmin = authorize();
const admin = authorize([ROLES.ADMIN]);
router.get('/', admin, MerchantController.get);
router.put('/', superadmin, MerchantController.update);

module.exports = router;
