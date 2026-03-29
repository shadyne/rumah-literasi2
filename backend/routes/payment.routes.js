const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');

router.post('/callback', PaymentController.callback);

module.exports = router;
