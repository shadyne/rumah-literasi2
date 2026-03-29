const ApiError = require('../libs/error');
const ApiResponse = require('../libs/response');
const SearchService = require('../libs/search-service');

const { User, sequelize } = require('../models');

const searchService = new SearchService(sequelize);

const UserController = {
	async index(req, res, next) {
		try {
			const { search, page, limit, role } = req.query;

			const filters = {};
			if (role) filters.role = role;

			const paginate = searchService.paginate({ page, limit });
			const result = await searchService.search(
				User,
				search,
				filters,
				{ page, limit },
				[],
				['name', 'email']
			);

			return res.json(
				new ApiResponse('Users retrieved successfully', {
					rows: result.rows,
					pagination: {
						total: result.count,
						page: paginate.page,
						limit: paginate.limit,
						pages: Math.ceil(result.count / paginate.limit),
					},
				})
			);
		} catch (error) {
			next(error);
		}
	},

	async store(req, res, next) {
		try {
			const password = req.body.password;
			if (!password) throw new ApiError(400, 'Password is required');

			const user = await User.create(req.body);

			return res.json(new ApiResponse('User created successfully', user));
		} catch (error) {
			next(error);
		}
	},

	async show(req, res, next) {
		try {
			const uuid = req.params.uuid;
			if (!uuid) throw new ApiError(400, 'UUID is required');

			const user = await User.findOne({
				where: { uuid },
				include: ['financial_donations', 'book_donations'],
			});

			if (!user) throw new ApiError(404, 'User not found');
			return res.json(new ApiResponse('User retrieved successfully', user));
		} catch (error) {
			next(error);
		}
	},

	async update(req, res, next) {
		try {
			const uuid = req.params.uuid;
			if (!uuid) throw new ApiError(400, 'UUID is required');

			const user = await User.findOne({
				where: { uuid },
			});

			if (!user) throw new ApiError(404, 'User not found');
			await user.update(req.body);
			await user.save();

			return res.json(new ApiResponse('User updated successfully', user));
		} catch (error) {
			next(error);
		}
	},

	async destroy(req, res, next) {
		try {
			const uuid = req.params.uuid;
			if (!uuid) throw new ApiError(400, 'UUID is required');

			const user = await User.findOne({
				where: { uuid },
			});
			if (!user) throw new ApiError(404, 'User not found');

			await user.destroy();
			return res.json(new ApiResponse('User deleted successfully', user));
		} catch (error) {
			next(error);
		}
	},
};

module.exports = UserController;
