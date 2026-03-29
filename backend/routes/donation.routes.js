const express = require('express');
const router = express.Router();
const DonationController = require('../controllers/donation.controller');

const { ROLES } = require('../libs/constant');
const { authorize } = require('../middleware/authorize');

const guest = authorize([ROLES.GUEST, ROLES.ADMIN]);
router.get('/', guest, DonationController.index);
router.post('/', guest, DonationController.store);
router.get('/:id', guest, DonationController.show);
router.delete('/:id', guest, DonationController.destroy);

const admin = authorize([ROLES.ADMIN]);
router.put('/:id', admin, DonationController.update);

module.exports = router;
