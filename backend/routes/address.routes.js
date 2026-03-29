const express = require('express');
const router = express.Router();
const AddressController = require('../controllers/address.controller');

router.get('/', AddressController.index);
router.post('/', AddressController.store);
router.get('/:id', AddressController.show);
router.put('/:id', AddressController.update);
router.delete('/:id', AddressController.destroy);
router.patch('/:id/default', AddressController.setDefault);

module.exports = router;
