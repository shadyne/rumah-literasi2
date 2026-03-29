const ApiError = require('../libs/error');
const ApiResponse = require('../libs/response');
const SearchService = require('../libs/search-service');

const { Log, sequelize } = require('../models');

const searchService = new SearchService(sequelize);

const LogController = {
	async index(req, res, next) {
		try {
			const { search, page, limit } = req.query;

			const filters = {};
			const paginate = searchService.paginate({ page, limit });

			const result = await searchService.search(
				Log,
				search,
				filters,
				{ page, limit },
				['user'],
				['action', 'message', 'resource_type', 'ip_address']
			);

			return res.json(
				new ApiResponse('Logs retrieved successfully', {
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

	async show(req, res, next) {
		try {
			const uuid = req.params.uuid;
			if (!uuid) throw new ApiError(400, 'UUID is required');

			const log = await Log.findOne({
				where: { uuid },
			});

			if (!log) throw new ApiError(404, 'Log not found');
			return res.json(new ApiResponse('Log retrieved successfully', log));
		} catch (error) {
			next(error);
		}
	},
};

module.exports = LogController;
