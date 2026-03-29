const express = require('express');
const router = express.Router();
const FinancialDonationController = require('../controllers/financial-donation.controller');

const { ROLES } = require('../libs/constant');
const { authorize } = require('../middleware/authorize');

const guest = authorize([ROLES.GUEST, ROLES.ADMIN]);
router.get('/', guest, FinancialDonationController.index);
router.post('/', guest, FinancialDonationController.store);
router.get('/:id', guest, FinancialDonationController.show);
router.delete('/:id', guest, FinancialDonationController.destroy);

const admin = authorize([ROLES.ADMIN]);
router.put('/:id', admin, FinancialDonationController.update);

module.exports = router;
