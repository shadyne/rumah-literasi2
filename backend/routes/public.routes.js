const express = require('express');
const router = express.Router();

const PublicController = require('../controllers/public.controller');

router.get('/events', PublicController.events);
router.get('/events/:id', PublicController.event);

module.exports = router;
