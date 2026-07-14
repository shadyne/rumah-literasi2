const express = require('express');

const { User } = require('../../models');
const errorHandler = require('../../middleware/errors');

const buildApp = () => {
	const app = express();

	app.use(express.json({ limit: '10mb' }));
	app.use(express.urlencoded({ extended: true }));

	app.use(async (req, res, next) => {
		try {
			const uuid = req.headers['x-actor-uuid'];
			if (!uuid) {
				return res.status(401).json({
					message: 'You are not authorized to access this resource',
				});
			}

			const user = await User.findOne({ where: { uuid } });
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
	});

	app.use(
		'/api/financial-donations',
		require('../../routes/financial-donation.routes')
	);
	app.use(
		'/api/book-donations',
		require('../../routes/book-donation.routes')
	);
	app.use('/api/addresses', require('../../routes/address.routes'));

	app.use((req, res) => {
		res.status(404).json({ message: 'Not Found' });
	});

	app.use(errorHandler);

	return app;
};

module.exports = { buildApp };
