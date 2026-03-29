const ApiError = require('../libs/error');
const ApiResponse = require('../libs/response');

const { Gift } = require('../models');
const { ROLES } = require('../libs/constant');

const GiftController = {
	async index(req, res, next) {
		try {
			const gifts = await Gift.scope({
				method: ['authorize', req.user, [ROLES.ADMIN]],
			}).findAll({
				include: 'user',
			});
			return res.json(new ApiResponse('Gifts retrieved successfully', gifts));
		} catch (error) {
			next(error);
		}
	},

	async store(req, res, next) {
		try {
			const gift = await Gift.create({
				...req.body,
				user_id: req.user.id,
			});

			return res.json(new ApiResponse('Gift created successfully', gift));
		} catch (error) {
			next(error);
		}
	},

	async show(req, res, next) {
		try {
			const id = req.params.id;
			if (!id) throw new ApiError(400, 'ID is required');

			const gift = await Gift.scope({
				method: ['authorize', req.user, [ROLES.ADMIN]],
			}).findOne({
				where: { id },
				include: 'user',
			});

			if (!gift) throw new ApiError(404, 'Gift not found');
			return res.json(new ApiResponse('Gift retrieved successfully', gift));
		} catch (error) {
			next(error);
		}
	},

	async update(req, res, next) {
		try {
			const id = req.params.id;
			if (!id) throw new ApiError(400, 'ID is required');

			const gift = await Gift.scope({
				method: ['authorize', req.user, [ROLES.ADMIN]],
			}).findOne({
				where: { id },
			});

			if (!gift) throw new ApiError(404, 'Gift not found');
			await gift.update(req.body);
			await gift.save();

			return res.json(new ApiResponse('Gift updated successfully', gift));
		} catch (error) {
			next(error);
		}
	},

	async destroy(req, res, next) {
		try {
			const id = req.params.id;
			if (!id) throw new ApiError(400, 'ID is required');

			const gift = await Gift.scope({
				method: ['authorize', req.user, [ROLES.ADMIN]],
			}).findOne({
				where: { id },
			});

			if (!gift) throw new ApiError(404, 'Gift not found');
			const pending = gift.status === 'pending';
			if (!pending) {
				throw new ApiError(
					400,
					'Cannot delete gift unless the status is pending'
				);
			}

			await gift.destroy();
			return res.json(new ApiResponse('Gift deleted successfully', gift));
		} catch (error) {
			next(error);
		}
	},
};

module.exports = GiftController;
