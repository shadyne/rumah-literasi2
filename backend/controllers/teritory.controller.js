const ApiError = require('../libs/error');
const ApiResponse = require('../libs/response');

const { Province, City, District } = require('../models');

const TeritoriesController = {
	async provinces(req, res, next) {
		try {
			const provinces = await Province.findAll({
				order: [['name', 'ASC']],
			});

			return res.json(
				new ApiResponse('Provinces retrieved successfully', provinces)
			);
		} catch (error) {
			next(error);
		}
	},

	async cities(req, res, next) {
		try {
			const { province_id } = req.params;

			const cities = await City.findAll({
				where: {
					province_id,
				},
				order: [['name', 'ASC']],
			});

			return res.json(new ApiResponse('Cities retrieved successfully', cities));
		} catch (error) {
			next(error);
		}
	},

	async districts(req, res, next) {
		try {
			const { province_id, city_id } = req.params;

			const city = await City.findOne({
				where: {
					id: city_id,
					province_id: province_id,
				},
			});
			if (!city) throw new ApiError(404, 'City not found');

			const districts = await District.findAll({
				where: {
					city_id: city.id,
				},
				order: [['name', 'ASC']],
			});

			return res.json(
				new ApiResponse('Districts retrieved successfully', districts)
			);
		} catch (error) {
			next(error);
		}
	},
};

module.exports = TeritoriesController;
