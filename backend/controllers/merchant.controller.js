const ApiError = require('../libs/error');
const ApiResponse = require('../libs/response');

const { Merchant } = require('../models');
const bitehsip = require('../libs/biteship');

const MerchantController = {
	async get(req, res, next) {
		try {
			const merchant = await Merchant.findOne();
			if (!merchant) throw new ApiError(404, 'Merchant not found');

			return res.json(
				new ApiResponse('Merchant retrieved successfully', merchant)
			);
		} catch (error) {
			next(error);
		}
	},

	async update(req, res, next) {
		try {
			const merchant = await Merchant.findOne();
			if (!merchant) throw new ApiError(404, 'Merchant not found');

			await merchant.update(req.body);
			await merchant.save();

			await bitehsip.post('/locations/' + merchant.area_id, {
				name: merchant.name,
				contact_name: merchant.contact_name,
				contact_phone: merchant.contact_phone,
				address: merchant.address,
				note: merchant.note,
				postal_code: merchant.zipcode,
				latitude: merchant.latitude,
				longitude: merchant.longitude,
				type: 'destination',
			});

			return res.json(
				new ApiResponse('Merchant updated successfully', merchant)
			);
		} catch (error) {
			next(error);
		}
	},
};

module.exports = MerchantController;
