const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/address.controller');

const { ROLES } = require('../libs/constant');
const { authorizeStrict } = require('../middleware/authorize');

const donaturStrict = authorizeStrict([ROLES.DONATUR]);

router.get('/', AddressController.index);
router.post('/', donaturStrict, AddressController.store);
router.get('/:id', AddressController.show);
router.put('/:id', donaturStrict, AddressController.update);
router.delete('/:id', donaturStrict, AddressController.destroy);
router.patch('/:id/default', donaturStrict, AddressController.setDefault);

module.exports = router;
