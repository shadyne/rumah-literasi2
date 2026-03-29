const ApiError = require('../libs/error');
const ApiResponse = require('../libs/response');
const SearchService = require('../libs/search-service');

const { Event, sequelize } = require('../models');

const searchService = new SearchService(sequelize);

const PublicController = {
	async events(req, res, next) {
		try {
			const { search, page, limit } = req.query;

			const filters = {};
			const paginate = searchService.paginate({ page, limit });
			const result = await searchService.search(
				Event,
				search,
				filters,
				{ page, limit },
				['user'],
				['title', 'description', 'location']
			);

			return res.json(
				new ApiResponse('Events retrieved successfully', {
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

	async event(req, res, next) {
		try {
			const id = req.params.id;
			if (!id) throw new ApiError(400, 'ID is required');

			const event = await Event.findOne({
				where: { id },
				include: ['user'],
			});

			if (!event) throw new ApiError(404, 'Event not found');
			return res.json(new ApiResponse('Event retrieved successfully', event));
		} catch (error) {
			next(error);
		}
	},
};

module.exports = PublicController;
