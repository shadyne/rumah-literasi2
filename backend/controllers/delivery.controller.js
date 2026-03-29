const crypto = require('crypto');

const biteship = require('../libs/biteship');
const ApiError = require('../libs/error');
const ApiResponse = require('../libs/response');
const { Merchant, Address } = require('../models');

const DeliveryController = {
	async draft(donation) {
		const merchant = await Merchant.findOne();
		if (!merchant) throw new Error('Merchant data not found in database');

		return await biteship.post('draft_orders', {
			origin_contact_name: donation.address.contact_name,
			origin_contact_phone: donation.address.contact_phone,
			origin_address: donation.address.street_address,
			origin_postal_code: donation.address.zipcode,
			origin_note: donation.address.note,
			destination_contact_name: merchant.name,
			destination_contact_phone: merchant.phone,
			destination_contact_email: merchant.email,
			destination_address: merchant.address,
			destination_postal_code: merchant.zipcode,
			destination_note: 'Book donation delivery',
			courier_company: donation.courier_code,
			courier_type: donation.courier_service_code,
			delivery_type: 'now',
			items: [
				{
					name: 'Book',
					description: 'Book donation for ' + merchant.name,
					value: Number(donation.estimated_value),
					length: Number(donation.length),
					width: Number(donation.width),
					height: Number(donation.height),
					weight: Number(donation.weight),
					quantity: 1,
				},
			],
		});
	},

	async confirm(donation) {
		if (!donation.order_id) throw new Error('No draft order found');
		return await biteship.post(
			'draft_orders/' + donation.order_id + '/confirm'
		);
	},

	async cancel(donation) {
		if (!donation.order_id) throw new Error('No draft order found ');
		return await biteship.delete('draft_orders/' + donation.order_id);
	},

	async track(donation) {
		return await biteship.get('trackings/' + donation.tracking_id);
	},

	async rates(req, res, next) {
		try {
			const { detail } = req.body;
			const merchant = await Merchant.findOne();
			if (!merchant) throw new ApiError(404, 'Merchant data not found');

			const address = await Address.scope({
				method: ['authorize', req.user],
			}).findOne({
				where: {
					id: detail.address_id,
				},
			});

			if (!address) throw new ApiError(404, 'Address data not found');
			if (!address.area_id) throw new ApiError(404, 'Address area not found');

			const { data } = await biteship.post('rates/couriers', {
				origin_postal_code: address.zipcode,
				destination_latitude: merchant.latitude,
				destination_longitude: merchant.longitude,
				couriers: 'gojek,anteraja,jnt,jne,sicepat',
				items: [
					{
						name: 'Book',
						description: 'Book donation for ' + merchant.name,
						value: Number(detail.estimated_value),
						length: Number(detail.length),
						width: Number(detail.width),
						height: Number(detail.height),
						weight: Number(detail.weight),
						quantity: 1,
					},
				],
			});

			return res.send(
				new ApiResponse(
					'Couriers fetched successfully',
					data.pricing.map((pricing) => ({
						...pricing,
						id: crypto.randomUUID(),
					}))
				)
			);
		} catch (error) {
			if (error instanceof ApiError) return next(error);
			return next(
				new ApiError(
					error.response?.status || 500,
					error.response?.data.message || error.message,
					error.response?.data
				)
			);
		}
	},
};

module.exports = DeliveryController;
