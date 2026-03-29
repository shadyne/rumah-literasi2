const express = require('express');
const router = express.Router();
const LogController = require('../controllers/log.controller');

const { ROLES } = require('../libs/constant');
const { authorize } = require('../middleware/authorize');

const admin = authorize([ROLES.ADMIN, ROLES.SUPERADMIN]);
router.get('/', admin, LogController.index);
router.get('/:uuid', admin, LogController.show);

module.exports = router;
