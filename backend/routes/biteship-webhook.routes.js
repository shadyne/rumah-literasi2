const express = require('express');

const BiteshipWebhookController = require('../controllers/biteship-webhook.controller');

const router = express.Router();

router.post('/', BiteshipWebhookController.handle);

module.exports = router;
