const express = require('express');
const router = express.Router();
const BookDonationController = require('../controllers/book-donation.controller');

const { ROLES } = require('../libs/constant');
const { authorize } = require('../middleware/authorize');
const { upload: local } = require('../middleware/local-upload');
const { upload: vercel } = require('../middleware/vercel-blob');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const upload = IS_PRODUCTION ? vercel : local;

const guest = authorize([ROLES.DONATUR, ROLES.ADMIN]);
router.get('/', guest, BookDonationController.index);
router.get('/:id', guest, BookDonationController.show);
router.get('/:id/track', guest, BookDonationController.track);

const guestOnly = authorize([ROLES.DONATUR]);
router.post('/', guestOnly, BookDonationController.store);
router.post(
	'/:id/pay',
	guestOnly,
	upload.single('payment_proof'),
	BookDonationController.pay
);
// Hanya pemilik yang boleh mengedit, dan hanya selama status PENDING
// (belum dibayar); dicek di controller.
router.put('/:id', guestOnly, BookDonationController.update);

const admin = authorize([ROLES.ADMIN]);
router.post('/:id/verify', admin, BookDonationController.verify);

// User boleh menghapus donasinya sendiri selama status PENDING; controller
// membatasi kepemilikan (scope) & memastikan draft Biteship ikut dibatalkan.
router.delete(
	'/:id',
	authorize([ROLES.DONATUR, ROLES.ADMIN]),
	BookDonationController.destroy
);

module.exports = router;
