const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

const { authorize } = require('../middleware/authorize');

const superadmin = authorize();
router.get('/', superadmin, UserController.index);
router.post('/', superadmin, UserController.store);
router.get('/:uuid', superadmin, UserController.show);
router.put('/:uuid', superadmin, UserController.update);
router.delete('/:uuid', superadmin, UserController.destroy);

module.exports = router;
