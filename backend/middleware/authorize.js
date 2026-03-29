const { ROLES } = require('../libs/constant');
const DEFAULT = [];

/**
 * Function to check if the user has the required role
 * @param {*} role
 * @returns
 */
const authorize =
	(roles = DEFAULT) =>
	async (req, res, next) => {
		try {
			if (!req.user) {
				return res.status(401).json({
					message: 'You are not authorized to access this resource',
				});
			}

			const check = new Set([...roles, ROLES.SUPERADMIN]);
			if (!check.has(req.user.role)) {
				return res.status(403).json({
					message: 'You are not authorized to access this resource',
				});
			}

			next();
		} catch (error) {
			next(error);
		}
	};

/**
 * Scope for the authorize middleware
 * @param {*} user
 * @returns
 */
const scope = {
	authorize(user, roles = []) {
		const check = new Set([...roles, ROLES.SUPERADMIN]);
		if (check.has(user.role)) return {};

		return {
			where: {
				user_id: user.id,
			},
		};
	},
};

module.exports = {
	scope,
	authorize,
};
