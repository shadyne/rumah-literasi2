const { User } = require('../models');

const authenticate = async (req, res, next) => {
	try {
		if (!req.session.userId) {
			return res.status(401).json({
				message: 'You are not authorized to access this resource',
			});
		}

		const user = await User.findOne({
			where: { uuid: req.session.userId },
		});

		if (!user) {
			return res.status(401).json({
				message: 'You are not authorized to access this resource',
			});
		}

		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	authenticate,
};
