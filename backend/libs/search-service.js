const { Op } = require('sequelize');

class SearchService {
	constructor(sequelize) {
		this.sequelize = sequelize;
		this.maximum = 50;
	}

	async search(model, search, filters, pagination, include = [], fields = []) {
		const initial = !search || fields.length === 0;

		if (initial) {
			return await model.findAndCountAll({
				where: { ...filters },
				include,
				limit: this.paginate(pagination).limit,
				offset: this.paginate(pagination).offset,
				order: [['createdAt', 'DESC']],
			});
		}

		const dialect = this.sequelize.getDialect();
		const operator = dialect === 'sqlite' ? Op.like : Op.iLike;
		const related = fields.some((field) => field.includes('$'));
		const where = {};

		const conditions = fields.map((field) => ({
			[field]: { [operator]: `%${search}%` },
		}));

		where[Op.or] = conditions;
		Object.assign(where, filters || {});

		return await model.findAndCountAll({
			where,
			include,
			limit: this.paginate(pagination).limit,
			offset: this.paginate(pagination).offset,
			order: [['createdAt', 'DESC']],
			subQuery: dialect === 'sqlite' && related ? false : undefined,
		});
	}

	paginate(pagination) {
		const page = parseInt(pagination.page) || 1;
		const limit = Math.min(parseInt(pagination.limit) || 5, this.maximum);
		const offset = (page - 1) * limit;

		return { limit, offset };
	}
}

module.exports = SearchService;
