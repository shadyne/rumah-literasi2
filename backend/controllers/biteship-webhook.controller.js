const crypto = require('crypto');

const { BookDonation } = require('../models');

const safeEqual = (value, expected) => {
	const actualBuffer = Buffer.from(String(value || ''));
	const expectedBuffer = Buffer.from(String(expected || ''));

	return (
		actualBuffer.length === expectedBuffer.length &&
		crypto.timingSafeEqual(actualBuffer, expectedBuffer)
	);
};

const BiteshipWebhookController = {
	async handle(req, res, next) {
		try {
			const headerName = String(
				process.env.BITESHIP_WEBHOOK_HEADER || 'x-biteship-webhook-secret'
			).toLowerCase();
			const secret = process.env.BITESHIP_WEBHOOK_SECRET;

			if (!secret) {
				return res.status(503).json({ message: 'Webhook is not configured' });
			}

			if (!safeEqual(req.headers[headerName], secret)) {
				return res.status(401).json({ message: 'Invalid webhook signature' });
			}

			const event = req.body.event;
			if (!['order.status', 'order.waybill_id'].includes(event)) {
				return res.json({ success: true });
			}

			const donation = await BookDonation.findOne({
				where: { order_id: req.body.order_id },
			});

			if (!donation) {
				return res.json({ success: true });
			}

			const payload = {};

			if (req.body.status) {
				payload.delivery_status = req.body.status;
				payload.delivery_status_updated_at = new Date();
			}

			if (req.body.courier_tracking_id) {
				payload.tracking_id = req.body.courier_tracking_id;
			}

			if (req.body.courier_waybill_id) {
				payload.waybill_id = req.body.courier_waybill_id;
			}

			if (Object.keys(payload).length > 0) {
				await donation.update(payload);
			}

			return res.json({ success: true });
		} catch (error) {
			next(error);
		}
	},
};

module.exports = BiteshipWebhookController;
